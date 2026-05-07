const { sql, pool } = require("../config/db");

const getAllUsers = async () => {
  const connection = await pool;
  const result = await connection.request().query("SELECT * FROM dbo.NguoiDung");
  return result.recordset;
};

const findByUsername = async (username) => {
  const connection = await pool;
  const result = await connection.request()
    .input("username", sql.VarChar, username)
    .query(`
      SELECT u.*, v.TenVaiTro 
      FROM dbo.NguoiDung u
      LEFT JOIN dbo.VaiTro v ON u.MaVaiTro = v.MaVaiTro
      WHERE u.TenDangNhap = @username
    `);
  return result.recordset[0];
};

const findByUsernameOrEmail = async (identifier) => {
  const connection = await pool;
  const result = await connection.request()
    .input("identifier", sql.VarChar, identifier)
    .query(`
      SELECT u.*, v.TenVaiTro 
      FROM dbo.NguoiDung u
      LEFT JOIN dbo.VaiTro v ON u.MaVaiTro = v.MaVaiTro
      WHERE u.TenDangNhap = @identifier OR u.Email = @identifier
    `);
  return result.recordset[0];
};

const createUser = async (userData) => {
  const { maNguoiDung, tenDangNhap, matKhauHash, hoTen, email, sdt, maVaiTro } = userData;
  const connection = await pool;
  const result = await connection.request()
    .input("maNguoiDung", sql.VarChar, maNguoiDung)
    .input("tenDangNhap", sql.VarChar, tenDangNhap)
    .input("matKhauHash", sql.VarChar, matKhauHash)
    .input("hoTen", sql.NVarChar, hoTen)
    .input("email", sql.VarChar, email)
    .input("sdt", sql.Char, sdt)
    .input("maVaiTro", sql.VarChar, maVaiTro)
    .query(`
      INSERT INTO dbo.NguoiDung (MaNguoiDung, TenDangNhap, MatKhauHash, HoTen, Email, SDT, MaVaiTro, NgayTao)
      VALUES (@maNguoiDung, @tenDangNhap, @matKhauHash, @hoTen, @email, @sdt, @maVaiTro, GETDATE());
      SELECT * FROM dbo.NguoiDung WHERE MaNguoiDung = @maNguoiDung;
    `);
  return result.recordset[0];
};

module.exports = {
  getAllUsers,
  findByUsername,
  findByUsernameOrEmail,
  createUser
};