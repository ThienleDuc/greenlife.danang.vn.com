const { sql, poolPromise } = require("../config/db");

const getThongKeData = async (tuNgay, denNgay, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai, page, limit) => {
  const connection = await poolPromise;
  const request = connection.request();
  
  let query = `
    SELECT 
      kh.MaKeHoach,
      kh.TieuDe,
      kh.NgayTao,
      kh.NgayPheDuyet,
      kh.NgayXuLy,
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

  const validDateFields = {
    'NgayTao': 'kh.NgayTao',
    'NgayPheDuyet': 'kh.NgayPheDuyet',
    'NgayXuLy': 'kh.NgayXuLy'
  };
  const dateField = validDateFields[loaiNgay] || 'kh.NgayTao';

  if (tuNgay) {
    query += ` AND ${dateField} >= @tuNgay`;
    request.input("tuNgay", sql.DateTime, new Date(tuNgay));
  }
  
  if (denNgay) {
    const end = new Date(denNgay);
    end.setHours(23, 59, 59, 999);
    query += ` AND ${dateField} <= @denNgay`;
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

  if (maLoaiCongViec) {
    query += ` AND kh.MaLoaiCongViec = @maLoaiCongViec`;
    request.input("maLoaiCongViec", sql.VarChar, maLoaiCongViec);
  }

  if (trangThai) {
    query += ` AND kh.TrangThai = @trangThai`;
    request.input("trangThai", sql.NVarChar, trangThai);
  }

  query += ` ORDER BY kh.MaKeHoach ASC`;

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
