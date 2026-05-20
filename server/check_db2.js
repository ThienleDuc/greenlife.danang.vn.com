require('dotenv').config();
const thongKeRepository = require('./src/repositories/thongke.repository');

async function run() {
    try {
        const data = await thongKeRepository.getThongKeData();
        console.log('ThongKeData:', data.slice(0, 2));
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}
run();
