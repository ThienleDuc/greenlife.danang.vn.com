const pheDuyetService = require("../services/pheduyet.service");

const getAllKeHoachPheDuyet = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const data = await pheDuyetService.getAllKeHoachPheDuyet(limit, offset, req.user);
    res.status(200).json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: "Lỗi khi lấy danh sách kế hoạch phê duyệt", error: error.message });
  }
};

const searchKeHoachPheDuyet = async (req, res) => {
  try {
    const filters = req.query;
    const data = await pheDuyetService.searchKeHoachPheDuyet(filters, req.user);
    res.status(200).json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: "Lỗi khi tìm kiếm kế hoạch phê duyệt", error: error.message });
  }
};

const getKeHoachChiTiet = async (req, res) => {
  try {
    const { maKeHoach } = req.params;
    const data = await pheDuyetService.getKeHoachChiTiet(maKeHoach, req.user);
    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy kế hoạch" });
    }
    res.status(200).json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: "Lỗi khi lấy chi tiết kế hoạch", error: error.message });
  }
};

const updateTrangThaiPheDuyet = async (req, res) => {
  try {
    const { maKeHoach } = req.params;
    const { trangThai, yKienPheDuyet, nguoiPheDuyet, removeFiles } = req.body;
    const filePDFBoSungKeHoach = req.file ? req.file.filename : null;

    // Parse removeFiles if it's sent as a JSON string (common with FormData)
    let parsedRemoveFiles = [];
    if (removeFiles) {
      try {
        parsedRemoveFiles = typeof removeFiles === 'string' ? JSON.parse(removeFiles) : removeFiles;
      } catch (e) {
        parsedRemoveFiles = [removeFiles]; // fallback for single string
      }
    }

    if (!trangThai) {
      return res.status(400).json({ message: "Trạng thái không được để trống" });
    }

    const result = await pheDuyetService.updateTrangThaiPheDuyet(
      maKeHoach,
      trangThai,
      yKienPheDuyet,
      nguoiPheDuyet,
      filePDFBoSungKeHoach,
      parsedRemoveFiles,
      req.user
    );
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: "Lỗi khi cập nhật trạng thái", error: error.message });
  }
};

const removeSpecificFile = async (req, res) => {
  try {
    const { maKeHoach, fileKey } = req.params;
    const { fileName } = req.query; // Nhận tên file cần xóa từ query string
    const result = await pheDuyetService.removeSpecificFile(maKeHoach, fileKey, fileName, req.user);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: "Lỗi khi gỡ file", error: error.message });
  }
};

module.exports = {
  getAllKeHoachPheDuyet,
  searchKeHoachPheDuyet,
  getKeHoachChiTiet,
  updateTrangThaiPheDuyet,
  removeSpecificFile
};
