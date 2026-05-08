const locationRepository = require("../repositories/location.repository");

const getXaPhuong = async (req, res) => {
  try {
    const xaPhuong = await locationRepository.getAllXaPhuong();
    res.status(200).json({
      success: true,
      data: xaPhuong
    });
  } catch (error) {
    console.error("Error in getXaPhuong:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách xã phường",
      error: error.message
    });
  }
};

const getTuyenDuong = async (req, res) => {
  try {
    const { maXaPhuong } = req.params;
    
    if (!maXaPhuong) {
      return res.status(400).json({
        success: false,
        message: "Mã xã phường là bắt buộc"
      });
    }

    const tuyenDuong = await locationRepository.getTuyenDuongByXaPhuong(maXaPhuong);
    res.status(200).json({
      success: true,
      data: tuyenDuong
    });
  } catch (error) {
    console.error("Error in getTuyenDuong:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách tuyến đường",
      error: error.message
    });
  }
};

const getAllTuyenDuong = async (req, res) => {
  try {
    const tuyenDuong = await locationRepository.getAllTuyenDuong();
    res.status(200).json({
      success: true,
      data: tuyenDuong
    });
  } catch (error) {
    console.error("Error in getAllTuyenDuong:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách tuyến đường",
      error: error.message
    });
  }
};

module.exports = {
  getXaPhuong,
  getTuyenDuong,
  getAllTuyenDuong
};
