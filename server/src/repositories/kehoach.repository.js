const { sql, poolPromise } = require("../config/db");

const getAllKeHoach = async (limit = 10, offset = 0) => {
  const connection = await poolPromise;

  const result = await connection
    .request()
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
        xp.MaXaPhuong,
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

  const countResult = await connection
    .request()
    .query(`SELECT COUNT(*) as total FROM dbo.KeHoachCongViec`);

  return {
    data: result.recordset,
    total: countResult.recordset[0].total,
    limit,
    offset,
  };
};

const buildKeHoachDetailQuery = (whereClause = "") => `
  SELECT
    kh.*,
    dm.TenCongViec,
    nl.HoTen AS TenNguoiLap,
    xl.HoTen AS TenNguoiXuLy,
    pd.HoTen AS TenNguoiPheDuyet,
    td.TenTuyenDuong,
    xp.MaXaPhuong,
    xp.TenXaPhuong
  FROM dbo.KeHoachCongViec kh
  LEFT JOIN dbo.DanhMucCongViec dm ON kh.MaLoaiCongViec = dm.MaLoaiCongViec
  LEFT JOIN dbo.NguoiDung nl ON kh.NguoiLap = nl.MaNguoiDung
  LEFT JOIN dbo.NguoiDung xl ON kh.NguoiXuLy = xl.MaNguoiDung
  LEFT JOIN dbo.NguoiDung pd ON kh.NguoiPheDuyet = pd.MaNguoiDung
  LEFT JOIN dbo.TuyenDuong td ON kh.MaTuyenDuong = td.MaTuyenDuong
  LEFT JOIN dbo.XaPhuong xp ON td.MaXaPhuong = xp.MaXaPhuong
  ${whereClause}
`;

const existsMaKeHoach = async (maKeHoach) => {
  const connection = await poolPromise;

  const result = await connection
    .request()
    .input("maKeHoach", sql.VarChar(20), maKeHoach)
    .query(`
      SELECT TOP 1 MaKeHoach
      FROM dbo.KeHoachCongViec
      WHERE MaKeHoach = @maKeHoach
    `);

  return result.recordset.length > 0;
};

const findByMaKeHoach = async (maKeHoach) => {
  const connection = await poolPromise;

  const result = await connection
    .request()
    .input("maKeHoach", sql.VarChar(20), maKeHoach)
    .query(buildKeHoachDetailQuery("WHERE kh.MaKeHoach = @maKeHoach"));

  return result.recordset[0] || null;
};

const getKeHoachCuaToi = async (nguoiLap) => {
  const connection = await poolPromise;

  const result = await connection
    .request()
    .input("nguoiLap", sql.VarChar(20), nguoiLap)
    .query(`
      ${buildKeHoachDetailQuery("WHERE kh.NguoiLap = @nguoiLap")}
      ORDER BY kh.NgayTao DESC
    `);

  return result.recordset;
};

const createKeHoach = async (planData) => {
  const connection = await poolPromise;

  await connection
    .request()
    .input("maKeHoach", sql.VarChar(20), planData.maKeHoach)
    .input("maLoaiCongViec", sql.VarChar(20), planData.maLoaiCongViec)
    .input("tieuDe", sql.NVarChar(200), planData.tieuDe)
    .input("moTa", sql.NVarChar(500), planData.moTa)
    .input("filePDFKeHoach", sql.VarChar, planData.filePDFKeHoach)
    .input("filePDFDeNghiCapPhep", sql.VarChar, planData.filePDFDeNghiCapPhep)
    .input("nguoiLap", sql.VarChar(20), planData.nguoiLap)
    .input("trangThai", sql.NVarChar(50), "Đã gửi")
    .input("maTuyenDuong", sql.VarChar(20), planData.maTuyenDuong)
    .query(`
      INSERT INTO dbo.KeHoachCongViec (
        MaKeHoach,
        MaLoaiCongViec,
        TieuDe,
        MoTa,
        FilePDFKeHoach,
        FilePDFDeNghiCapPhep,
        NguoiLap,
        TrangThai,
        FilePDFBoSungKeHoach,
        YKienPheDuyet,
        NguoiPheDuyet,
        NgayPheDuyet,
        NgayTao,
        NgayCapNhat,
        NguoiXuLy,
        NgayXuLy,
        MaTuyenDuong
      )
      VALUES (
        @maKeHoach,
        @maLoaiCongViec,
        @tieuDe,
        @moTa,
        @filePDFKeHoach,
        @filePDFDeNghiCapPhep,
        @nguoiLap,
        @trangThai,
        NULL,
        NULL,
        NULL,
        NULL,
        GETDATE(),
        NULL,
        NULL,
        NULL,
        @maTuyenDuong
      )
    `);

  return await findByMaKeHoach(planData.maKeHoach);
};

const updateKeHoach = async (planData) => {
  const connection = await poolPromise;

  const result = await connection
    .request()
    .input("maKeHoach", sql.VarChar(20), planData.maKeHoach)
    .input("nguoiLap", sql.VarChar(20), planData.nguoiLap)
    .input("maLoaiCongViec", sql.VarChar(20), planData.maLoaiCongViec)
    .input("tieuDe", sql.NVarChar(200), planData.tieuDe)
    .input("moTa", sql.NVarChar(500), planData.moTa)
    .input("filePDFKeHoach", sql.VarChar, planData.filePDFKeHoach)
    .input("filePDFDeNghiCapPhep", sql.VarChar, planData.filePDFDeNghiCapPhep)
    .input("filePDFBoSungKeHoach", sql.VarChar, planData.filePDFBoSungKeHoach)
    .input("maTuyenDuong", sql.VarChar(20), planData.maTuyenDuong)
    .input("trangThai", sql.NVarChar(50), "Đã gửi")
    .query(`
      UPDATE dbo.KeHoachCongViec
      SET
        MaLoaiCongViec = @maLoaiCongViec,
        TieuDe = @tieuDe,
        MoTa = @moTa,
        FilePDFKeHoach = COALESCE(@filePDFKeHoach, FilePDFKeHoach),
        FilePDFDeNghiCapPhep = COALESCE(@filePDFDeNghiCapPhep, FilePDFDeNghiCapPhep),
        FilePDFBoSungKeHoach = COALESCE(@filePDFBoSungKeHoach, FilePDFBoSungKeHoach),
        MaTuyenDuong = @maTuyenDuong,
        TrangThai = @trangThai,
        NgayCapNhat = GETDATE()
      WHERE MaKeHoach = @maKeHoach
        AND NguoiLap = @nguoiLap
        AND TrangThai IN (N'Đã gửi', N'Bị từ chối')
    `);

  if (!result.rowsAffected[0]) {
    return null;
  }

  return await findByMaKeHoach(planData.maKeHoach);
};

const huyKeHoach = async (maKeHoach, nguoiLap) => {
  const connection = await poolPromise;

  const result = await connection
    .request()
    .input("maKeHoach", sql.VarChar(20), maKeHoach)
    .input("nguoiLap", sql.VarChar(20), nguoiLap)
    .input("trangThai", sql.NVarChar(50), "Đã hủy")
    .query(`
      UPDATE dbo.KeHoachCongViec
      SET
        TrangThai = @trangThai,
        NgayCapNhat = GETDATE()
      WHERE MaKeHoach = @maKeHoach
        AND NguoiLap = @nguoiLap
        AND TrangThai IN (N'Đã gửi', N'Bị từ chối')
    `);

  if (!result.rowsAffected[0]) {
    return null;
  }

  return await findByMaKeHoach(maKeHoach);
};

/**
 * Tìm kiếm đa năng kế hoạch công việc
 */
const searchKeHoach = async (filters) => {
  const {
    title,
    status,
    processor,
    xaPhuong,
    tuyenDuong,
    startDate,
    endDate,
    dateType,
    jobType,
    limit = 10,
    offset = 0,
  } = filters;

  const connection = await poolPromise;
  const request = connection.request();

  let query = `
    SELECT 
      kh.*,
      dm.TenCongViec,
      nl.HoTen AS TenNguoiLap,
      xl.HoTen AS TenNguoiXuLy,
      pd.HoTen AS TenNguoiPheDuyet,
      td.TenTuyenDuong,
      xp.MaXaPhuong,
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

  if (status && status !== "Tất cả") {
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
    const colName = dateType || "NgayTao";
    query += ` AND kh.${colName} BETWEEN @startDate AND @endDate`;
    request.input("startDate", sql.DateTime, new Date(startDate));

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    request.input("endDate", sql.DateTime, end);
  }

  // Count query for pagination
  const countQuery = `SELECT COUNT(*) as total FROM (${query}) AS T`;
  const countResult = await request.query(countQuery);

  // Data query
  query += ` ORDER BY kh.NgayTao DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
  request.input("limit", sql.Int, parseInt(limit, 10));
  request.input("offset", sql.Int, parseInt(offset, 10));

  const result = await request.query(query);

  return {
    data: result.recordset,
    total: countResult.recordset[0].total,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
  };
};

/**
 * Lấy thống kê số lượng kế hoạch theo trạng thái
 */
const getKeHoachStats = async () => {
  const connection = await poolPromise;
  const result = await connection.request().query(`
    SELECT TrangThai, COUNT(*) as Count
    FROM dbo.KeHoachCongViec
    GROUP BY TrangThai
  `);

  const stats = {
    daGui: 0,
    dangThamDinh: 0,
    daPheDuyet: 0,
    biTuChoi: 0,
    daHuy: 0,
    total: 0,
  };

  result.recordset.forEach((row) => {
    const count = row.Count;
    stats.total += count;

    switch (row.TrangThai) {
      case "Đã gửi":
        stats.daGui = count;
        break;
      case "Đang thẩm định":
      case "Đang chờ duyệt":
        stats.dangThamDinh += count;
        break;
      case "Đã phê duyệt":
      case "đã phê duyệt":
      case "Được duyệt":
        stats.daPheDuyet += count;
        break;
      case "Bị từ chối":
      case "bị từ chối":
        stats.biTuChoi += count;
        break;
      case "Đã hủy":
        stats.daHuy = count;
        break;
    }
  });

  return stats;
};

module.exports = {
  getAllKeHoach,
  searchKeHoach,
  getKeHoachStats,
  existsMaKeHoach,
  findByMaKeHoach,
  getKeHoachCuaToi,
  createKeHoach,
  updateKeHoach,
  huyKeHoach,
};
