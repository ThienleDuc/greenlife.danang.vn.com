const cron = require("node-cron");
const { poolPromise } = require("../config/db");

const runAutoHuyQuaHan = async () => {
  try {
    console.log("[Cron Job] Bắt đầu quét và tự động hủy các kế hoạch quá hạn...");
    const connection = await poolPromise;
    const result = await connection.request().query(`
      UPDATE dbo.KeHoachCongViec
      SET TrangThai = N'Đã hủy',
          NgayCapNhat = GETDATE()
      WHERE TrangThai IN (N'Đã gửi', N'Đang thẩm định')
        AND NguoiPheDuyet IS NULL
        AND DATEDIFF(DAY, NgayTao, GETDATE()) > 15;
    `);
    console.log(`[Cron Job] Đã tự động hủy thành công ${result.rowsAffected[0]} kế hoạch quá hạn.`);
  } catch (err) {
    console.error("[Cron Job] Lỗi khi thực hiện tự động hủy kế hoạch quá hạn:", err);
  }
};

const initCronJobs = () => {
  // Chạy ngay lập tức một lần khi khởi động server
  runAutoHuyQuaHan();

  // Lập lịch chạy lúc 00:00 hàng ngày
  cron.schedule("0 0 * * *", runAutoHuyQuaHan);
  
  console.log("[Cron Job] Đã đăng ký lịch chạy tự động hủy kế hoạch quá hạn (00:00 hàng ngày).");
};

module.exports = {
  initCronJobs
};
