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

const validatePlanPayload = (payload) => {
  if (!payload.maLoaiCongViec) {
    throw createHttpError("Vui lòng chọn loại kế hoạch");
  }

  if (!payload.tieuDe) {
    throw createHttpError("Vui lòng nhập tiêu đề kế hoạch");
  }

  if (payload.tieuDe.length > 200) {
    throw createHttpError("Tiêu đề kế hoạch không được vượt quá 200 ký tự");
  }

  if (!payload.moTa) {
    throw createHttpError("Vui lòng nhập mô tả ngắn");
  }

  if (payload.moTa.length > 500) {
    throw createHttpError("Mô tả ngắn không được vượt quá 500 ký tự");
  }

  if (!payload.maTuyenDuong) {
    throw createHttpError("Vui lòng chọn tuyến đường");
  }
};

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

  validatePlanPayload(planPayload);

  const filePDFKeHoach = getUploadedFileName(files, "fileKeHoach");
  const filePDFDeNghiCapPhep = getUploadedFileName(files, "fileDeNghiCapPhep");

  if (!filePDFKeHoach) {
    throw createHttpError("Vui lòng tải file PDF kế hoạch");
  }

  if (PERMIT_REQUIRED_TYPES.includes(planPayload.maLoaiCongViec) && !filePDFDeNghiCapPhep) {
    throw createHttpError("Vui lòng tải file PDF đề nghị cấp phép cho kế hoạch di dời / chặt hạ");
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

  if (plan.TrangThai === PLAN_STATUS.DA_PHE_DUYET) {
    throw createHttpError(
      `Kế hoạch đã phê duyệt, không thể ${action}`,
      409
    );
  }

  if (action === "hủy" && plan.TrangThai === PLAN_STATUS.DA_HUY) {
    throw createHttpError("Kế hoạch đã ở trạng thái hủy", 409);
  }

  if (!EDITABLE_STATUSES.includes(plan.TrangThai)) {
    throw createHttpError(`Kế hoạch ở trạng thái "${plan.TrangThai}" không thể ${action}`, 409);
  }

  return plan;
};

const updateKeHoach = async (maKeHoach, payload, files, user) => {
  const nguoiLap = getCurrentUserId(user);
  const currentPlan = await assertEditablePlan(maKeHoach, nguoiLap);
  const planPayload = normalizePlanPayload(payload);

  validatePlanPayload(planPayload);

  const filePDFKeHoach = getUploadedFileName(files, "fileKeHoach");
  const filePDFDeNghiCapPhep = getUploadedFileName(files, "fileDeNghiCapPhep");
  
  let removeFiles = [];
  try {
    removeFiles = payload.removeFiles ? JSON.parse(payload.removeFiles) : [];
  } catch(e) {}
  
  const isKeHoachRemoved = removeFiles.includes("fileKeHoach");
  const isDeNghiRemoved = removeFiles.includes("fileDeNghiCapPhep");

  if (!filePDFKeHoach && (!currentPlan.FilePDFKeHoach || isKeHoachRemoved)) {
    throw createHttpError("Vui lòng tải file pdf kế hoạch công việc");
  }

  if (
    PERMIT_REQUIRED_TYPES.includes(planPayload.maLoaiCongViec) &&
    !filePDFDeNghiCapPhep &&
    (!currentPlan.FilePDFDeNghiCapPhep || isDeNghiRemoved)
  ) {
    throw createHttpError("Vui lòng tải file đề nghị cấp phép");
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
  await assertEditablePlan(maKeHoach, nguoiLap, "hủy");

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
