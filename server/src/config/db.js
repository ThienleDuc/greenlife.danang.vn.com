const sql = require("mssql");

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // localhost hoặc IP
  database: process.env.DB_NAME,
  options: {
    encrypt: false, // true nếu dùng Azure
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch(err => {
    console.error("DB Connection Failed:", err);
  });

module.exports = {
  sql,
  pool,
};