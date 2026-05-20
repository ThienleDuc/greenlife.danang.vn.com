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
      xp.TenXaPhuong
    FROM dbo.KeHoachCongViec kh
    LEFT JOIN dbo.TuyenDuong td ON kh.MaTuyenDuong = td.MaTuyenDuong
    LEFT JOIN dbo.XaPhuong xp ON td.MaXaPhuong = xp.MaXaPhuong
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

  query += ` ORDER BY kh.NgayCapNhat DESC, kh.NgayPheDuyet DESC, kh.NgayXuLy DESC, kh.NgayTao DESC`;

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
