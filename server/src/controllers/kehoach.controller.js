const keHoachService = require("../services/kehoach.service");
const { deleteUploadedFiles } = require("../utils/pdfUpload.utils");

const sendError = (res, error, fallbackMessage = "Lỗi xử lý kế hoạch công việc") => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || fallbackMessage,
  });
};

const getAllKeHoach = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    const data = await keHoachService.getAllKeHoach(limit, offset);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách kế hoạch công việc", error: error.message });
  }
};

const searchKeHoach = async (req, res) => {
  try {
    const filters = req.query;
    const data = await keHoachService.searchKeHoach(filters);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tìm kiếm kế hoạch công việc", error: error.message });
  }
};

const getKeHoachStats = async (req, res) => {
  try {
    const data = await keHoachService.getKeHoachStats();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thống kê kế hoạch công việc", error: error.message });
  }
};

const getKeHoachCuaToi = async (req, res) => {
  try {
    const data = await keHoachService.getKeHoachCuaToi(req.user);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    sendError(res, error, "Lỗi khi lấy kế hoạch của tôi");
  }
};

const getKeHoachByMa = async (req, res) => {
  try {
    const data = await keHoachService.getKeHoachByMa(req.params.maKeHoach);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    sendError(res, error, "Lỗi khi lấy chi tiết kế hoạch");
  }
};

const createKeHoach = async (req, res) => {
  try {
    const data = await keHoachService.createKeHoach(req.body, req.files, req.user);

    res.status(201).json({
      success: true,
      message: "Gửi kế hoạch thành công",
      data,
    });
  } catch (error) {
    deleteUploadedFiles(req.files);
    sendError(res, error, "Không thể gửi kế hoạch, vui lòng thử lại");
  }
};

const updateKeHoach = async (req, res) => {
  try {
    const data = await keHoachService.updateKeHoach(
      req.params.maKeHoach,
      req.body,
      req.files,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật kế hoạch thành công",
      data,
    });
  } catch (error) {
    deleteUploadedFiles(req.files);
    sendError(res, error, "Không thể cập nhật kế hoạch, vui lòng thử lại");
  }
};

const huyKeHoach = async (req, res) => {
  try {
    const data = await keHoachService.huyKeHoach(req.params.maKeHoach, req.user);

    res.status(200).json({
      success: true,
      message: "Hủy kế hoạch thành công",
      data,
    });
  } catch (error) {
    sendError(res, error, "Không thể hủy kế hoạch, vui lòng thử lại");
  }
};

module.exports = {
  getAllKeHoach,
  searchKeHoach,
  getKeHoachStats,
  getKeHoachCuaToi,
  getKeHoachByMa,
  createKeHoach,
  updateKeHoach,
  huyKeHoach
};
