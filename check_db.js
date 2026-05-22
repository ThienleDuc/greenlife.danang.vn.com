require('dotenv').config({ path: './server/.env' });
const { sql, pool } = require('./server/src/config/db');
pool.then(async (p) => {
    try {
        const kh = await p.request().query('SELECT TOP 5 MaKeHoach, TieuDe, NguoiLap, NguoiPheDuyet FROM KeHoachCongViec');
        console.log('KeHoachCongViec:', kh.recordset);

        const nd = await p.request().query('SELECT TOP 5 MaNguoiDung, HoTen FROM NguoiDung');
        console.log('NguoiDung:', nd.recordset);
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
});
