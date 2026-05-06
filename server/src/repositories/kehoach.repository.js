const { sql, pool } = require("../config/db");

const getAllKeHoach = async (limit = 10, offset = 0) => {
  const connection = await pool;
  const result = await connection.request()
    .input("limit", sql.Int, limit)
    .input("offset", sql.Int, offset)
    .query(`
      SELECT 
        kh.*,
        dm.TenCongViec,
        nl.HoTen AS TenNguoiLap,
        xl.HoTen AS TenNguoiXuLy,
        pd.HoTen AS TenNguoiPheDuyet,
        td.TenTuyenDuong,
        xp.TenXaPhuong
      FROM dbo.KeHoachCongViec kh
      LEFT JOIN dbo.DanhMucCongViec dm ON kh.MaLoaiCongViec = dm.MaLoaiCongViec
      LEFT JOIN dbo.NguoiDung nl ON kh.NguoiLap = nl.MaNguoiDung
      LEFT JOIN dbo.NguoiDung xl ON kh.NguoiXuLy = xl.MaNguoiDung
      LEFT JOIN dbo.NguoiDung pd ON kh.NguoiPheDuyet = pd.MaNguoiDung
      LEFT JOIN dbo.TuyenDuong td ON kh.MaTuyenDuong = td.MaTuyenDuong
      LEFT JOIN dbo.XaPhuong xp ON td.MaXaPhuong = xp.MaXaPhuong
      ORDER BY kh.NgayTao DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);
    
  const countResult = await connection.request().query(`SELECT COUNT(*) as total FROM dbo.KeHoachCongViec`);
  
  return {
    data: result.recordset,
    total: countResult.recordset[0].total,
    limit,
    offset
  };
};

/**
 * Tìm kiếm đa năng kế hoạch công việc
 */
const searchKeHoach = async (filters) => {
  const { title, status, processor, xaPhuong, tuyenDuong, startDate, endDate, dateType, jobType, limit = 10, offset = 0 } = filters;
  const connection = await pool;
  const request = connection.request();

  let query = `
    SELECT 
      kh.*,
      dm.TenCongViec,
      nl.HoTen AS TenNguoiLap,
      xl.HoTen AS TenNguoiXuLy,
      pd.HoTen AS TenNguoiPheDuyet,
      td.TenTuyenDuong,
      xp.TenXaPhuong
    FROM dbo.KeHoachCongViec kh
    LEFT JOIN dbo.DanhMucCongViec dm ON kh.MaLoaiCongViec = dm.MaLoaiCongViec
    LEFT JOIN dbo.NguoiDung nl ON kh.NguoiLap = nl.MaNguoiDung
    LEFT JOIN dbo.NguoiDung xl ON kh.NguoiXuLy = xl.MaNguoiDung
    LEFT JOIN dbo.NguoiDung pd ON kh.NguoiPheDuyet = pd.MaNguoiDung
    LEFT JOIN dbo.TuyenDuong td ON kh.MaTuyenDuong = td.MaTuyenDuong
    LEFT JOIN dbo.XaPhuong xp ON td.MaXaPhuong = xp.MaXaPhuong
    WHERE 1=1
  `;

  if (title) {
    query += ` AND kh.TieuDe LIKE @title`;
    request.input("title", sql.NVarChar, `%${title}%`);
  }

  if (status && status !== 'Tất cả') {
    query += ` AND kh.TrangThai = @status`;
    request.input("status", sql.NVarChar, status);
  }

  if (jobType) {
    query += ` AND kh.MaLoaiCongViec = @jobType`;
    request.input("jobType", sql.VarChar, jobType);
  }

  if (processor) {
    query += ` AND (nl.HoTen LIKE @processor OR xl.HoTen LIKE @processor)`;
    request.input("processor", sql.NVarChar, `%${processor}%`);
  }

  if (xaPhuong) {
    query += ` AND xp.MaXaPhuong = @xaPhuong`;
    request.input("xaPhuong", sql.VarChar, xaPhuong);
  }

  if (tuyenDuong) {
    query += ` AND kh.MaTuyenDuong = @tuyenDuong`;
    request.input("tuyenDuong", sql.VarChar, tuyenDuong);
  }

  if (startDate && endDate) {
    const colName = dateType || 'NgayTao';
    query += ` AND kh.${colName} BETWEEN @startDate AND @endDate`;
    request.input("startDate", sql.DateTime, new Date(startDate));
    // Set endDate to end of day
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    request.input("endDate", sql.DateTime, end);
  }

  // Count query for pagination
  const countQuery = `SELECT COUNT(*) as total FROM (` + query + `) AS T`;
  const countResult = await request.query(countQuery);

  // Data query
  query += ` ORDER BY kh.NgayTao DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
  request.input("limit", sql.Int, parseInt(limit));
  request.input("offset", sql.Int, parseInt(offset));

  const result = await request.query(query);

  return {
    data: result.recordset,
    total: countResult.recordset[0].total,
    limit: parseInt(limit),
    offset: parseInt(offset)
  };
};

module.exports = {
  getAllKeHoach,
  searchKeHoach
};
