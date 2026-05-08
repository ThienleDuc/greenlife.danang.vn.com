const danhmucRepository = require("../repositories/danhmuc.repository");

const getDanhMucCongViec = async (req, res) => {
  try {
    const data = await danhmucRepository.getDanhMucCongViec();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getDanhMucCongViec:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh mục công việc",
      error: error.message
    });
  }
};

module.exports = {
  getDanhMucCongViec
};
