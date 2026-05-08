const { sql, pool } = require("../config/db");

/**
 * Lấy tất cả xã phường
 */
const getAllXaPhuong = async () => {
  const connection = await pool;
  const result = await connection.request().query(`
    SELECT MaXaPhuong, TenXaPhuong, MaHanhChinh, LoaiDanhMuc
    FROM dbo.XaPhuong
    ORDER BY TenXaPhuong ASC
  `);
  return result.recordset;
};

/**
 * Lấy danh sách tuyến đường theo mã xã phường
 * @param {string} maXaPhuong 
 */
const getTuyenDuongByXaPhuong = async (maXaPhuong) => {
  const connection = await pool;
  const result = await connection.request()
    .input("maXaPhuong", sql.VarChar(20), maXaPhuong)
    .query(`
      SELECT MaTuyenDuong, TenTuyenDuong, TenVietTat, LoaiDuong, MaXaPhuong
      FROM dbo.TuyenDuong
      WHERE MaXaPhuong = @maXaPhuong
      ORDER BY TenTuyenDuong ASC
    `);
  return result.recordset;
};

/**
 * Lấy danh sách tất cả tuyến đường
 */
const getAllTuyenDuong = async () => {
  const connection = await pool;
  const result = await connection.request().query(`
    SELECT MaTuyenDuong, TenTuyenDuong, TenVietTat, LoaiDuong, MaXaPhuong
    FROM dbo.TuyenDuong
    ORDER BY TenTuyenDuong ASC
  `);
  return result.recordset;
};

module.exports = {
  getAllXaPhuong,
  getTuyenDuongByXaPhuong,
  getAllTuyenDuong
};
