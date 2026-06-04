const { sql, poolPromise } = require('./src/config/db');

async function test() {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("maKeHoach", sql.VarChar(20), "KHTEST123")
            .input("maLoaiCongViec", sql.VarChar(20), "CHATHA") 
            .input("tieuDe", sql.NVarChar(200), "")
            .input("moTa", sql.NVarChar(500), "")
            .input("filePDFKeHoach", sql.VarChar, "")
            .input("filePDFDeNghiCapPhep", sql.VarChar, "")
            .input("nguoiLap", sql.VarChar(20), "m3Lp8Qz1xK5vB9cJ2hF4") 
            .input("trangThai", sql.NVarChar(50), "Đã gửi")
            .input("maTuyenDuong", sql.VarChar(20), "BD") 
            .query(`
                INSERT INTO dbo.KeHoachCongViec (
                    MaKeHoach, MaLoaiCongViec, TieuDe, MoTa, FilePDFKeHoach, FilePDFDeNghiCapPhep,
                    NguoiLap, TrangThai, MaTuyenDuong, NgayTao, NgayCapNhat
                ) VALUES (
                    @maKeHoach, @maLoaiCongViec, @tieuDe, @moTa, @filePDFKeHoach, @filePDFDeNghiCapPhep,
                    @nguoiLap, @trangThai, @maTuyenDuong, GETDATE(), GETDATE()
                )
            `);
        console.log("Success:", result);
    } catch (err) {
        console.log("Caught Error:");
        console.log(JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    } finally {
        process.exit(0);
    }
}

test();
