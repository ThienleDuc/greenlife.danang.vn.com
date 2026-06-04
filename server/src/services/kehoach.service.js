const keHoachRepo = require("../repositories/kehoach.repository");
const crypto = require("crypto");
const { deletePdfFile } = require("../utils/pdfUpload.utils");
const { generateToken } = require("../utils/jwt.utils");

const PLAN_STATUS = {
  DA_GUI: "Đã gửi",
  DANG_THAM_DINH: "Đang thẩm định",
  DA_PHE_DUYET: "Đã phê duyệt",
  BI_TU_CHOI: "Bị từ chối",
  DA_HUY: "Đã hủy",
};

const EDITABLE_STATUSES = [PLAN_STATUS.DA_GUI, PLAN_STATUS.BI_TU_CHOI, PLAN_STATUS.DA_HUY];
const PERMIT_REQUIRED_TYPES = ["DDCH"];

const createHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getCurrentUserId = (user) => {
  if (!user || !user.id) {
    throw createHttpError("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn", 401);
  }

  return user.id;
};

const getUploadedFileName = (files, fieldName) => {
  const uploadedFile = files?.[fieldName]?.[0];
  return uploadedFile?.filename || null;
};

const normalizePlanPayload = (payload = {}) => ({
  maLoaiCongViec: String(payload.maLoaiCongViec || "").trim(),
  tieuDe: String(payload.tieuDe || "").trim(),
  moTa: String(payload.moTa || "").trim(),
  maTuyenDuong: String(payload.maTuyenDuong || "").trim(),
});

const generateMaKeHoach = async () => {
  let maKeHoach;
  let existed = true;

  while (existed) {
    maKeHoach = `KH${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
    existed = await keHoachRepo.existsMaKeHoach(maKeHoach);
  }

  return maKeHoach;
};

const searchKeHoach = async (filters) => {
  return await keHoachRepo.searchKeHoach(filters);
};

const getKeHoachStats = async () => {
  return await keHoachRepo.getKeHoachStats();
};

const getKeHoachCuaToi = async (user) => {
  const nguoiLap = getCurrentUserId(user);
  return await keHoachRepo.getKeHoachCuaToi(nguoiLap);
};

const getKeHoachByMa = async (maKeHoach) => {
  const normalizedMaKeHoach = String(maKeHoach || "").trim();

  if (!normalizedMaKeHoach) {
    throw createHttpError("Mã kế hoạch là bắt buộc");
  }

  const plan = await keHoachRepo.findByMaKeHoach(normalizedMaKeHoach);

  if (!plan) {
    throw createHttpError("Không tìm thấy kế hoạch công việc", 404);
  }

  return plan;
};

const createKeHoach = async (payload, files, user) => {
  const nguoiLap = payload.nguoiLap || getCurrentUserId(user);
  const planPayload = normalizePlanPayload(payload);

  const filePDFKeHoach = getUploadedFileName(files, "fileKeHoach");
  const filePDFDeNghiCapPhep = getUploadedFileName(files, "fileDeNghiCapPhep");

  if (!planPayload.tieuDe || !planPayload.maLoaiCongViec || !planPayload.maTuyenDuong || !filePDFKeHoach || !filePDFDeNghiCapPhep) {
    throw createHttpError("LẬP KẾ HOẠCH MỚI: Các trường bắt buộc (Tiêu đề, Loại công việc, Tuyến đường, và các file PDF) không được để trống.", 400);
  }

  if (planPayload.tieuDe.length > 200 || planPayload.moTa.length > 500) {
    throw createHttpError("DỮ LIỆU KHÔNG HỢP LỆ: Tiêu đề không được vượt quá 200 ký tự, Mô tả không vượt quá 500 ký tự.", 400);
  }

  const maKeHoach = await generateMaKeHoach();

  return await keHoachRepo.createKeHoach({
    ...planPayload,
    maKeHoach,
    filePDFKeHoach,
    filePDFDeNghiCapPhep,
    nguoiLap,
  });
};

const assertEditablePlan = async (maKeHoach, nguoiLap, action = "chỉnh sửa") => {
  const plan = await keHoachRepo.findByMaKeHoach(maKeHoach);

  if (!plan) {
    throw createHttpError("Không tìm thấy kế hoạch công việc", 404);
  }

  if (plan.NguoiLap !== nguoiLap) {
    throw createHttpError("Không có quyền thao tác kế hoạch này", 403);
  }

  return plan;
};

const updateKeHoach = async (maKeHoach, payload, files, user) => {
  const nguoiLap = getCurrentUserId(user);
  const currentPlan = await assertEditablePlan(maKeHoach, nguoiLap);
  
  if (currentPlan.TrangThai === PLAN_STATUS.DA_HUY) {
    throw createHttpError("Không thể chỉnh sửa kế hoạch đã ở trạng thái \"Đã hủy\".", 400);
  }

  if (![PLAN_STATUS.DA_GUI, PLAN_STATUS.BI_TU_CHOI].includes(currentPlan.TrangThai)) {
    throw createHttpError("Chỉ được chỉnh sửa kế hoạch khi trạng thái là \"Đã gửi\" hoặc \"Bị từ chối\".", 400);
  }

  const daysSinceCreation = (new Date() - new Date(currentPlan.NgayTao)) / (1000 * 60 * 60 * 24);
  if (currentPlan.TrangThai === PLAN_STATUS.BI_TU_CHOI && user.role !== 'NVKT' && daysSinceCreation <= 15) {
    throw createHttpError("Chỉ nhân viên kỹ thuật (NVKT) mới được phép gửi lại kế hoạch sau khi bị từ chối.", 403);
  }

  const planPayload = normalizePlanPayload(payload);

  const filePDFKeHoach = getUploadedFileName(files, "fileKeHoach");
  const filePDFDeNghiCapPhep = getUploadedFileName(files, "fileDeNghiCapPhep");
  
  let removeFiles = [];
  try {
    removeFiles = payload.removeFiles ? JSON.parse(payload.removeFiles) : [];
  } catch(e) {}
  
  const isKeHoachRemoved = removeFiles.includes("fileKeHoach");
  const isDeNghiRemoved = removeFiles.includes("fileDeNghiCapPhep");

  const hasKeHoach = !isKeHoachRemoved && (filePDFKeHoach || currentPlan.FilePDFKeHoach);
  const hasDeNghi = !isDeNghiRemoved && (filePDFDeNghiCapPhep || currentPlan.FilePDFDeNghiCapPhep);

  if (currentPlan.TrangThai === PLAN_STATUS.DA_GUI) {
    if (!planPayload.tieuDe || !planPayload.maLoaiCongViec || !planPayload.maTuyenDuong || !hasKeHoach || !hasDeNghi) {
      throw createHttpError("CHỈNH SỬA KẾ HOẠCH: Các trường bắt buộc (Tiêu đề, Loại công việc, Tuyến đường, và các file PDF) không được để trống.", 400);
    }
  }

  if (planPayload.tieuDe.length > 200 || planPayload.moTa.length > 500) {
    throw createHttpError("DỮ LIỆU KHÔNG HỢP LỆ: Ký tự vượt quá giới hạn cho phép (Tiêu đề <= 200, Mô tả <= 500, Ý kiến phê duyệt <= 200).", 400);
  }

  const updatedPlan = await keHoachRepo.updateKeHoach({
    ...planPayload,
    maKeHoach,
    nguoiLap,
    nguoiXuLy: payload.nguoiXuLy || nguoiLap,
    filePDFKeHoach,
    filePDFDeNghiCapPhep,
    removeKeHoach: isKeHoachRemoved,
    removeDeNghi: isDeNghiRemoved,
  });

  if (!updatedPlan) {
    throw createHttpError("Không thể cập nhật kế hoạch công việc", 400);
  }

  // Xóa các file cũ nếu có file mới được tải lên thay thế thành công, hoặc người dùng yêu cầu xóa
  if ((filePDFKeHoach || isKeHoachRemoved) && currentPlan.FilePDFKeHoach) {
    deletePdfFile(currentPlan.FilePDFKeHoach);
  }
  if ((filePDFDeNghiCapPhep || isDeNghiRemoved) && currentPlan.FilePDFDeNghiCapPhep) {
    deletePdfFile(currentPlan.FilePDFDeNghiCapPhep);
  }

  return updatedPlan;
};

const huyKeHoach = async (maKeHoach, user) => {
  const nguoiLap = getCurrentUserId(user);
  const currentPlan = await assertEditablePlan(maKeHoach, nguoiLap, "hủy");

  const daysSinceCreation = (new Date() - new Date(currentPlan.NgayTao)) / (1000 * 60 * 60 * 24);

  if (currentPlan.TrangThai === PLAN_STATUS.BI_TU_CHOI && daysSinceCreation > 15) {
    throw createHttpError("Kế hoạch bị từ chối đã quá 15 ngày không được phép hủy nữa.", 400);
  }

  if (user.role !== 'NVKT' && daysSinceCreation <= 15) {
    throw createHttpError("Chỉ nhân viên kỹ thuật (NVKT) mới được phép hủy kế hoạch.", 403);
  }

  if (![PLAN_STATUS.DA_GUI, PLAN_STATUS.BI_TU_CHOI].includes(currentPlan.TrangThai) && daysSinceCreation <= 15) {
    throw createHttpError("Chỉ được hủy kế hoạch khi trạng thái là \"Đã gửi\" hoặc \"Bị từ chối\".", 400);
  }

  const canceledPlan = await keHoachRepo.huyKeHoach(maKeHoach, nguoiLap);

  if (!canceledPlan) {
    throw createHttpError("Không thể hủy kế hoạch công việc", 400);
  }

  return canceledPlan;
};

module.exports = {
  searchKeHoach,
  getKeHoachStats,
  getKeHoachCuaToi,
  getKeHoachByMa,
  createKeHoach,
  updateKeHoach,
  huyKeHoach
};
