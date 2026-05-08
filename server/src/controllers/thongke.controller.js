const thongKeService = require("../services/thongke.service");
const userRepository = require("../repositories/user.repository");

const getThongKeTongQuan = async (req, res) => {
  try {
    const { tuNgay, denNgay, maTuyenDuong, maXaPhuong } = req.query;
    const data = await thongKeService.getTongQuan(tuNgay, denNgay, maTuyenDuong, maXaPhuong);
    res.status(200).json(data);
  } catch (error) {
    console.error("Lỗi lấy thống kê:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const exportExcel = async (req, res) => {
  try {
    const { tuNgay, denNgay, maTuyenDuong, maXaPhuong } = req.query;
    
    let nguoiXuat = 'Cán bộ quản lý';
    if (req.user && req.user.username) {
      const userObj = await userRepository.findByUsername(req.user.username);
      if (userObj && userObj.HoTen) {
        nguoiXuat = userObj.HoTen;
      }
    }
    
    const buffer = await thongKeService.exportExcel(tuNgay, denNgay, nguoiXuat, maTuyenDuong, maXaPhuong);
    
    res.setHeader('Content-Disposition', 'attachment; filename=BaoCaoThongKe.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error("Lỗi xuất báo cáo Excel:", error);
    res.status(500).json({ message: "Lỗi xuất báo cáo" });
  }
};

const exportPDF = async (req, res) => {
  try {
    const { tuNgay, denNgay, maTuyenDuong, maXaPhuong } = req.query;
    
    let nguoiXuat = 'Cán bộ quản lý';
    if (req.user && req.user.username) {
      const userObj = await userRepository.findByUsername(req.user.username);
      if (userObj && userObj.HoTen) {
        nguoiXuat = userObj.HoTen;
      }
    }
    
    const buffer = await thongKeService.exportPDF(tuNgay, denNgay, nguoiXuat, maTuyenDuong, maXaPhuong);
    
    res.setHeader('Content-Disposition', 'attachment; filename=BaoCaoThongKe.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (error) {
    console.error("Lỗi xuất báo cáo PDF:", error);
    res.status(500).json({ message: "Lỗi xuất báo cáo" });
  }
};

module.exports = {
  getThongKeTongQuan,
  exportExcel,
  exportPDF
};
