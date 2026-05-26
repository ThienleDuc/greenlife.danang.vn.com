const pheDuyetRepo = require("../repositories/pheduyet.repository");
const fs = require("fs");
const path = require("path");
const { isQuanLy } = require("../utils/role.utils");
const { PDF_DIR, deletePdfFile } = require("../utils/pdfUpload.utils");

const createHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const assertQuanLy = (user) => {
  if (!user) {
    throw createHttpError("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn", 401);
  }
  if (!isQuanLy(user)) {
    throw createHttpError("Bạn không có quyền quản lý để thực hiện thao tác này", 403);
  }
};

const checkAndCleanPlanFiles = (keHoach) => {
  if (!keHoach) return keHoach;
  
  const checkFileExists = (fileName) => {
    if (!fileName) return false;
    const filePath = path.join(PDF_DIR, fileName);
    return fs.existsSync(filePath);
  };

  // Check FilePDFKeHoach
  if (keHoach.FilePDFKeHoach && !checkFileExists(keHoach.FilePDFKeHoach)) {
    keHoach.FilePDFKeHoach = null;
  }

  // Check FilePDFDeNghiCapPhep
  if (keHoach.FilePDFDeNghiCapPhep && !checkFileExists(keHoach.FilePDFDeNghiCapPhep)) {
    keHoach.FilePDFDeNghiCapPhep = null;
  }

  // Check FilePDFBoSungKeHoach (which could be comma-separated)
  if (keHoach.FilePDFBoSungKeHoach) {
    const files = keHoach.FilePDFBoSungKeHoach.split(",");
    const existingFiles = files.filter(f => checkFileExists(f.trim()));
    keHoach.FilePDFBoSungKeHoach = existingFiles.length > 0 ? existingFiles.join(",") : null;
  }

  return keHoach;
};

const getAllKeHoachPheDuyet = async (limit, offset, user) => {
  assertQuanLy(user);
  const result = await pheDuyetRepo.getAllKeHoachPheDuyet(limit, offset);
  if (result && result.data) {
    result.data = result.data.map(p => checkAndCleanPlanFiles(p));
  }
  return result;
};

const searchKeHoachPheDuyet = async (filters, user) => {
  assertQuanLy(user);
  const result = await pheDuyetRepo.searchKeHoachPheDuyet(filters);
  if (result && result.data) {
    result.data = result.data.map(p => checkAndCleanPlanFiles(p));
  }
  return result;
};

const getKeHoachChiTiet = async (maKeHoach, user) => {
  assertQuanLy(user);
  const result = await pheDuyetRepo.getKeHoachChiTiet(maKeHoach);
  if (result && result.keHoach) {
    result.keHoach = checkAndCleanPlanFiles(result.keHoach);
  }
  return result;
};
const removeSpecificFile = async (maKeHoach, fileKey, fileName, user) => {
  assertQuanLy(user);

  if (fileName) {
    deletePdfFile(fileName);
  }

  return await pheDuyetRepo.removeSpecificFile(maKeHoach, fileKey, fileName);
};

const updateTrangThaiPheDuyet = async (maKeHoach, trangThai, yKienPheDuyet, nguoiPheDuyet, filePDFBoSungKeHoach, removeFiles, user, nguoiXuLy = null, isCancelApproval = false) => {
  assertQuanLy(user);

  const detail = await pheDuyetRepo.getKeHoachChiTiet(maKeHoach);
  if (!detail || !detail.keHoach) {
    throw createHttpError("Không tìm thấy kế hoạch", 404);
  }
  const currentPlan = detail.keHoach;

  if (isCancelApproval) {
    if (nguoiXuLy !== currentPlan.NguoiPheDuyet) {
      throw createHttpError("HỦY PHÊ DUYỆT: Chỉ tài khoản đã ra quyết định phê duyệt/từ chối trước đó mới có quyền hủy.", 403);
    }
    
    const daysSinceCreation = (new Date() - new Date(currentPlan.NgayTao)) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > 15) {
      throw createHttpError("HỦY PHÊ DUYỆT: Không thể hủy kết quả vì kế hoạch đã được tạo quá 15 ngày.", 400);
    }
  } else {
    if (trangThai === 'Đã phê duyệt' && !nguoiPheDuyet) {
      throw createHttpError("PHÊ DUYỆT KẾ HOẠCH: Phải có thông tin người phê duyệt.", 400);
    }
    
    if (trangThai === 'Bị từ chối' && (!nguoiPheDuyet || !yKienPheDuyet || yKienPheDuyet.trim() === '')) {
      throw createHttpError("TỪ CHỐI KẾ HOẠCH: Phải có thông tin người phê duyệt và ý kiến phê duyệt (lý do từ chối).", 400);
    }

    if (yKienPheDuyet && yKienPheDuyet.length > 200) {
      throw createHttpError("DỮ LIỆU KHÔNG HỢP LỆ: Ký tự vượt quá giới hạn cho phép (Tiêu đề <= 200, Mô tả <= 500, Ý kiến phê duyệt <= 200).", 400);
    }
  }

  const filesToRemove = removeFiles ? [...removeFiles] : [];
  if (isCancelApproval && !filesToRemove.includes('FilePDFBoSungKeHoach')) {
    filesToRemove.push('FilePDFBoSungKeHoach');
  }

  if (filesToRemove.length > 0) {
    try {
      const detail = await pheDuyetRepo.getKeHoachChiTiet(maKeHoach);
      if (detail && detail.keHoach) {
        const plan = detail.keHoach;
        if (filesToRemove.includes('FilePDFKeHoach') && plan.FilePDFKeHoach) {
          deletePdfFile(plan.FilePDFKeHoach);
        }
        if (filesToRemove.includes('FilePDFDeNghiCapPhep') && plan.FilePDFDeNghiCapPhep) {
          deletePdfFile(plan.FilePDFDeNghiCapPhep);
        }
        if (filesToRemove.includes('FilePDFBoSungKeHoach') && plan.FilePDFBoSungKeHoach) {
          const files = plan.FilePDFBoSungKeHoach.split(",");
          files.forEach(f => deletePdfFile(f.trim()));
        }

        // Handle specific file names removed by the user in the frontend UI
        for (const fName of filesToRemove) {
           if (fName !== 'FilePDFKeHoach' && fName !== 'FilePDFDeNghiCapPhep' && fName !== 'FilePDFBoSungKeHoach') {
             // Treat it as a specific FilePDFBoSungKeHoach item
             if (plan.FilePDFBoSungKeHoach && plan.FilePDFBoSungKeHoach.includes(fName)) {
               await removeSpecificFile(maKeHoach, 'FilePDFBoSungKeHoach', fName, user);
             }
           }
        }
      }
    } catch (err) {
      console.error("Lỗi khi xóa file vật lý trong lúc cập nhật phê duyệt:", err);
    }
  }

  return await pheDuyetRepo.updateTrangThaiPheDuyet(maKeHoach, trangThai, yKienPheDuyet, nguoiPheDuyet, filePDFBoSungKeHoach, filesToRemove, nguoiXuLy, isCancelApproval);
};




module.exports = {
  getAllKeHoachPheDuyet,
  searchKeHoachPheDuyet,
  getKeHoachChiTiet,
  updateTrangThaiPheDuyet,
  removeSpecificFile
};

