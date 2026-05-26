const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const password = process.argv[2];

if (!password) {
  console.log("Vui lòng nhập mật khẩu cần mã hóa.");
  console.log("Cách dùng: node hash-password.js <mật_khẩu>");
  process.exit(1);
}

async function run() {
  try {
    const md5Hash = crypto.createHash('md5').update(password).digest('hex');
    const salt = await bcrypt.genSalt(10);
    const bcryptHash = await bcrypt.hash(password, salt);

    console.log("--------------------------------------------------");
    console.log(`Mật khẩu gốc:   "${password}"`);
    console.log(`MD5 Hash:       ${md5Hash}`);
    console.log(`Bcrypt Hash:    ${bcryptHash}`);
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("Lỗi khi mã hóa:", error);
  }
}

run();
