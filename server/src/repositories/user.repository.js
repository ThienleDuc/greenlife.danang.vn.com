const { sql, poolPromise } = require("../config/db");

const getAllUsers = async () => {
  const connection = await poolPromise;
  const result = await connection.request().query("SELECT * FROM dbo.NguoiDung");
  return result.recordset;
};

const findByUsername = async (username) => {
  const connection = await poolPromise;
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

const findByMaNguoiDung = async (maNguoiDung) => {
  const connection = await poolPromise;
  const result = await connection.request()
    .input("maNguoiDung", sql.VarChar(20), maNguoiDung)
    .query(`
      SELECT u.*, v.TenVaiTro 
      FROM dbo.NguoiDung u
      LEFT JOIN dbo.VaiTro v ON u.MaVaiTro = v.MaVaiTro
      WHERE u.MaNguoiDung = @maNguoiDung
    `);
  return result.recordset[0];
};

const findByUsernameOrEmail = async (identifier) => {
  const connection = await poolPromise;
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
  const { maNguoiDung, tenDangNhap, matKhauHash, hoTen, email, sdt, maVaiTro, anhDaiDien } = userData;
  const connection = await poolPromise;
  const result = await connection.request()
    .input("maNguoiDung", sql.VarChar, maNguoiDung)
    .input("tenDangNhap", sql.VarChar, tenDangNhap)
    .input("matKhauHash", sql.VarChar, matKhauHash)
    .input("hoTen", sql.NVarChar, hoTen)
    .input("email", sql.VarChar, email)
    .input("sdt", sql.Char, sdt)
    .input("maVaiTro", sql.VarChar, maVaiTro)
    .input("anhDaiDien", sql.VarChar, anhDaiDien || null)
    .query(`
      INSERT INTO dbo.NguoiDung (MaNguoiDung, TenDangNhap, MatKhauHash, HoTen, Email, SDT, MaVaiTro, AnhDaiDien, NgayTao)
      VALUES (@maNguoiDung, @tenDangNhap, @matKhauHash, @hoTen, @email, @sdt, @maVaiTro, @anhDaiDien, GETDATE());
      SELECT * FROM dbo.NguoiDung WHERE MaNguoiDung = @maNguoiDung;
    `);
  return result.recordset[0];
};

module.exports = {
  getAllUsers,
  findByUsername,
  findByMaNguoiDung,
  findByUsernameOrEmail,
  createUser
};