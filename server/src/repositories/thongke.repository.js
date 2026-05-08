const { sql, pool } = require("../config/db");

const getThongKeData = async (tuNgay, denNgay, maTuyenDuong, maXaPhuong) => {
  const connection = await pool;
  const request = connection.request();
  
  let query = `
    SELECT 
      kh.MaKeHoach,
      kh.TieuDe,
      kh.NgayTao,
      kh.TrangThai,
      nl.HoTen AS NguoiLap,
      pd.HoTen AS NguoiPheDuyet,
      td.TenTuyenDuong,
      cv.TenCongViec
    FROM dbo.KeHoachCongViec kh
    LEFT JOIN dbo.NguoiDung nl ON kh.NguoiLap = nl.MaNguoiDung
    LEFT JOIN dbo.NguoiDung pd ON kh.NguoiPheDuyet = pd.MaNguoiDung
    LEFT JOIN dbo.TuyenDuong td ON kh.MaTuyenDuong = td.MaTuyenDuong
    LEFT JOIN dbo.DanhMucCongViec cv ON kh.MaLoaiCongViec = cv.MaLoaiCongViec
    WHERE 1=1
  `;

  if (tuNgay) {
    query += ` AND kh.NgayTao >= @tuNgay`;
    request.input("tuNgay", sql.DateTime, new Date(tuNgay));
  }
  
  if (denNgay) {
    const end = new Date(denNgay);
    end.setHours(23, 59, 59, 999);
    query += ` AND kh.NgayTao <= @denNgay`;
    request.input("denNgay", sql.DateTime, end);
  }

  if (maTuyenDuong) {
    query += ` AND kh.MaTuyenDuong = @maTuyenDuong`;
    request.input("maTuyenDuong", sql.VarChar, maTuyenDuong);
  }

  if (maXaPhuong) {
    query += ` AND td.MaXaPhuong = @maXaPhuong`;
    request.input("maXaPhuong", sql.VarChar, maXaPhuong);
  }

  query += ` ORDER BY kh.MaKeHoach ASC`;
  
  const result = await request.query(query);
  return result.recordset;
};

module.exports = {
  getThongKeData
};
