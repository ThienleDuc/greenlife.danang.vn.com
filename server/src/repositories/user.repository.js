const { sql, pool } = require("../config/db");

const getAllUsers = async () => {
  const connection = await pool;
  const result = await connection.request().query("SELECT * FROM dbo.Users");
  return result.recordset;
};

module.exports = {
  getAllUsers,
};