const handleDbError = (error, fallbackMessage) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || fallbackMessage;
  let dbError = error;

  // Khi trigger gọi ROLLBACK TRANSACTION, lỗi chính sẽ là 3609.
  // Lỗi thực sự từ RAISERROR nằm trong precedingErrors.
  if (error.number === 3609 && error.precedingErrors && error.precedingErrors.length > 0) {
    dbError = error.precedingErrors.find(e => e.number === 50000) || error.precedingErrors[0];
    message = dbError.message;
  }

  // Kiểm tra nếu là lỗi custom từ SQL Server RAISERROR (thường có mã lỗi 50000)
  if (dbError.number === 50000 || dbError.code === 'EREQUEST') {
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
