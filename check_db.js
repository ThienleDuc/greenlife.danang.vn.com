require('dotenv').config({ path: './server/.env' });
const { sql, pool } = require('./server/src/config/db');
pool.then(async (p) => {
    try {
        const result = await p.request().query('SELECT name FROM sys.tables');
        console.log('Tables:', result.recordset.map(r => r.name));

        const columns = await p.request().query("SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'KeHoachCongViec'");
        console.log('Columns:', columns.recordset);
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
});
