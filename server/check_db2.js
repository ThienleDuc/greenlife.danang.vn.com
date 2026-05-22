require('dotenv').config();
const thongKeRepository = require('./src/repositories/thongke.repository');

async function run() {
    try {
        const data = await thongKeRepository.getThongKeData('2026-04-20', '2026-06-20', '', '', 'Đã phê duyệt', '', '');
        console.log('ThongKeData with Đã phê duyệt:', data.map(d => ({ kh: d.MaKeHoach, tt: d.TrangThai, pd: d.NgayPheDuyet })));
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}
run();
