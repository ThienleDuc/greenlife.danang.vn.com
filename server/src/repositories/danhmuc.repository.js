const { sql, pool } = require("../config/db");

const getDanhMucCongViec = async () => {
  const connection = await pool;
  const result = await connection.request().query(`
    SELECT MaLoaiCongViec, TenCongViec, MoTaCV
    FROM dbo.DanhMucCongViec
    ORDER BY TenCongViec ASC
  `);
  return result.recordset;
};

module.exports = {
  getDanhMucCongViec
};
