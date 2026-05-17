const pheDuyetRepo = require("../repositories/pheduyet.repository");
const fs = require("fs");
const path = require("path");

const checkAndCleanPlanFiles = (keHoach) => {
  if (!keHoach) return keHoach;
  
  const checkFileExists = (fileName) => {
    if (!fileName) return false;
    const filePath = path.join(__dirname, "../../../client/public/pdf", fileName);
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

const getAllKeHoachPheDuyet = async (limit, offset) => {
  const result = await pheDuyetRepo.getAllKeHoachPheDuyet(limit, offset);
  if (result && result.data) {
    result.data = result.data.map(p => checkAndCleanPlanFiles(p));
  }
  return result;
};

const searchKeHoachPheDuyet = async (filters) => {
  const result = await pheDuyetRepo.searchKeHoachPheDuyet(filters);
  if (result && result.data) {
    result.data = result.data.map(p => checkAndCleanPlanFiles(p));
  }
  return result;
};

const getKeHoachChiTiet = async (maKeHoach) => {
  const result = await pheDuyetRepo.getKeHoachChiTiet(maKeHoach);
  if (result && result.keHoach) {
    result.keHoach = checkAndCleanPlanFiles(result.keHoach);
  }
  return result;
};

const updateTrangThaiPheDuyet = async (maKeHoach, trangThai, yKienPheDuyet, nguoiPheDuyet, filePDFBoSungKeHoach, removeFiles) => {
  return await pheDuyetRepo.updateTrangThaiPheDuyet(maKeHoach, trangThai, yKienPheDuyet, nguoiPheDuyet, filePDFBoSungKeHoach, removeFiles);
};

const removeSpecificFile = async (maKeHoach, fileKey, fileName) => {
  return await pheDuyetRepo.removeSpecificFile(maKeHoach, fileKey, fileName);
};

module.exports = {
  getAllKeHoachPheDuyet,
  searchKeHoachPheDuyet,
  getKeHoachChiTiet,
  updateTrangThaiPheDuyet,
  removeSpecificFile
};

