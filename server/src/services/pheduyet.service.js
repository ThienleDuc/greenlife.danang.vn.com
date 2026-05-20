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

const updateTrangThaiPheDuyet = async (maKeHoach, trangThai, yKienPheDuyet, nguoiPheDuyet, filePDFBoSungKeHoach, removeFiles, user) => {
  assertQuanLy(user);

  if (removeFiles && removeFiles.length > 0) {
    try {
      const detail = await pheDuyetRepo.getKeHoachChiTiet(maKeHoach);
      if (detail && detail.keHoach) {
        const plan = detail.keHoach;
        if (removeFiles.includes('FilePDFKeHoach') && plan.FilePDFKeHoach) {
          deletePdfFile(plan.FilePDFKeHoach);
        }
        if (removeFiles.includes('FilePDFDeNghiCapPhep') && plan.FilePDFDeNghiCapPhep) {
          deletePdfFile(plan.FilePDFDeNghiCapPhep);
        }
        if (removeFiles.includes('FilePDFBoSungKeHoach') && plan.FilePDFBoSungKeHoach) {
          const files = plan.FilePDFBoSungKeHoach.split(",");
          files.forEach(f => deletePdfFile(f.trim()));
        }
      }
    } catch (err) {
      console.error("Lỗi khi xóa file vật lý trong lúc cập nhật phê duyệt:", err);
    }
  }

  return await pheDuyetRepo.updateTrangThaiPheDuyet(maKeHoach, trangThai, yKienPheDuyet, nguoiPheDuyet, filePDFBoSungKeHoach, removeFiles);
};

const removeSpecificFile = async (maKeHoach, fileKey, fileName, user) => {
  assertQuanLy(user);

  if (fileName) {
    deletePdfFile(fileName);
  }

  return await pheDuyetRepo.removeSpecificFile(maKeHoach, fileKey, fileName);
};

module.exports = {
  getAllKeHoachPheDuyet,
  searchKeHoachPheDuyet,
  getKeHoachChiTiet,
  updateTrangThaiPheDuyet,
  removeSpecificFile
};

