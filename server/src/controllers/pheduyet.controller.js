const pheDuyetService = require("../services/pheduyet.service");

const getAllKeHoachPheDuyet = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const data = await pheDuyetService.getAllKeHoachPheDuyet(limit, offset);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách kế hoạch phê duyệt", error: error.message });
  }
};

const searchKeHoachPheDuyet = async (req, res) => {
  try {
    const filters = req.query;
    const data = await pheDuyetService.searchKeHoachPheDuyet(filters);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tìm kiếm kế hoạch phê duyệt", error: error.message });
  }
};

const getKeHoachChiTiet = async (req, res) => {
  try {
    const { maKeHoach } = req.params;
    const data = await pheDuyetService.getKeHoachChiTiet(maKeHoach);
    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy kế hoạch" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết kế hoạch", error: error.message });
  }
};

const updateTrangThaiPheDuyet = async (req, res) => {
  try {
    const { maKeHoach } = req.params;
    const { trangThai, yKienPheDuyet, nguoiPheDuyet } = req.body;

    if (!trangThai) {
      return res.status(400).json({ message: "Trạng thái không được để trống" });
    }

    const result = await pheDuyetService.updateTrangThaiPheDuyet(
      maKeHoach,
      trangThai,
      yKienPheDuyet,
      nguoiPheDuyet
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: error.message });
  }
};

module.exports = {
  getAllKeHoachPheDuyet,
  searchKeHoachPheDuyet,
  getKeHoachChiTiet,
  updateTrangThaiPheDuyet,
};
