const keHoachService = require("../services/kehoach.service");

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

module.exports = {
  getAllKeHoach,
  searchKeHoach
};
