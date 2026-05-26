const handleDbError = (error, fallbackMessage) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || fallbackMessage;

  // Kiểm tra nếu là lỗi custom từ SQL Server RAISERROR (thường có mã lỗi 50000)
  if (error.number === 50000 || error.code === 'EREQUEST') {
    statusCode = 400; // Đổi thành 400 Bad Request vì là lỗi nghiệp vụ (validation từ trigger)
    
    // Loại bỏ tiền tố của SQL Server (vd: "[Microsoft][ODBC Driver 17 for SQL Server][SQL Server]")
    if (message.includes('[SQL Server]')) {
      message = message.split('[SQL Server]')[1].trim();
    } else if (message.includes(']')) {
      const parts = message.split(']');
      message = parts[parts.length - 1].trim();
    }
  }

  return { statusCode, message };
};

module.exports = {
  handleDbError
};
