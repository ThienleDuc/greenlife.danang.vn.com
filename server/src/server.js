require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });
const app = require("./app");
const { initCronJobs } = require("./services/cron.service");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  // Khởi tạo các cron job chạy ngầm
  initCronJobs();
});
