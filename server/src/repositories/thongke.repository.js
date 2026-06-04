const { sql, poolPromise } = require("../config/db");

const getThongKeData = async (tuNgay, denNgay, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai, page, limit) => {
  const connection = await poolPromise;
  const request = connection.request();
  
  let query = `
    SELECT 
      kh.MaKeHoach,
      kh.TieuDe,
      kh.TrangThai,
      kh.NgayTao,
      kh.NgayPheDuyet,
      kh.NgayXuLy,
      td.TenTuyenDuong,
      cv.TenCongViec,
      xp.MaXaPhuong,
      xp.TenXaPhuong,
      nl.HoTen AS NguoiLap,
      xl.HoTen AS NguoiXuLy
    FROM dbo.KeHoachCongViec kh
    LEFT JOIN dbo.TuyenDuong td ON kh.MaTuyenDuong = td.MaTuyenDuong
    LEFT JOIN dbo.XaPhuong xp ON td.MaXaPhuong = xp.MaXaPhuong
    LEFT JOIN dbo.DanhMucCongViec cv ON kh.MaLoaiCongViec = cv.MaLoaiCongViec
    LEFT JOIN dbo.NguoiDung nl ON kh.NguoiLap = nl.MaNguoiDung
    LEFT JOIN dbo.NguoiDung xl ON kh.NguoiXuLy = xl.MaNguoiDung
    WHERE 1=1
  `;

  let dateField = 'kh.NgayTao';
  if (loaiNgay === 'Đã phê duyệt') {
    dateField = 'kh.NgayPheDuyet';
  } else if (loaiNgay === 'Bị từ chối' || loaiNgay === 'Đã hủy') {
    dateField = 'kh.NgayXuLy';
  }

  if (tuNgay) {
    query += ` AND ${dateField} >= @tuNgay`;
    request.input("tuNgay", sql.VarChar, `${tuNgay} 00:00:00`);
  }
  
  if (denNgay) {
    query += ` AND ${dateField} <= @denNgay`;
    request.input("denNgay", sql.VarChar, `${denNgay} 23:59:59.999`);
  }

  if (loaiNgay && loaiNgay !== 'Tất cả') {
    query += ` AND kh.TrangThai = @loaiNgayStatus`;
    request.input("loaiNgayStatus", sql.NVarChar, loaiNgay);
  }

  if (maTuyenDuong) {
    query += ` AND kh.MaTuyenDuong = @maTuyenDuong`;
    request.input("maTuyenDuong", sql.VarChar, maTuyenDuong);
  }

  if (maXaPhuong) {
    query += ` AND td.MaXaPhuong = @maXaPhuong`;
    request.input("maXaPhuong", sql.VarChar, maXaPhuong);
  }

  if (maLoaiCongViec) {
    query += ` AND kh.MaLoaiCongViec = @maLoaiCongViec`;
    request.input("maLoaiCongViec", sql.VarChar, maLoaiCongViec);
  }

  if (trangThai) {
    query += ` AND kh.TrangThai = @trangThai`;
    request.input("trangThai", sql.NVarChar, trangThai);
  }

  query += ` ORDER BY kh.NgayTao ASC`;

  if (page && limit) {
    const offset = (page - 1) * limit;
    query += ` OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);
  }
  
  const result = await request.query(query);
  return result.recordset;
};

module.exports = {
  getThongKeData
};
