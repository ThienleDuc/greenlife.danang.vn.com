const pheDuyetRepo = require("../repositories/pheduyet.repository");

const getAllKeHoachPheDuyet = async (limit, offset) => {
  return await pheDuyetRepo.getAllKeHoachPheDuyet(limit, offset);
};

const searchKeHoachPheDuyet = async (filters) => {
  return await pheDuyetRepo.searchKeHoachPheDuyet(filters);
};

const getKeHoachChiTiet = async (maKeHoach) => {
  return await pheDuyetRepo.getKeHoachChiTiet(maKeHoach);
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
