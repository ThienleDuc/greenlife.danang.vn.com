const { sql, poolPromise } = require("../config/db");

/**
 * Lấy danh sách kế hoạch cần phê duyệt (tất cả trừ đang thẩm định)
 */
const getAllKeHoachPheDuyet = async (limit = 10, offset = 0) => {
  const connection = await poolPromise;
  const result = await connection
    .request()
    .input("limit", sql.Int, limit)
    .input("offset", sql.Int, offset)
    .query(`
      SELECT 
        kh.*,
        dm.TenCongViec,
        nl.HoTen AS TenNguoiLap,
        xl.HoTen AS TenNguoiXuLy,
        pd.HoTen AS TenNguoiPheDuyet,
        td.TenTuyenDuong,
        xp.TenXaPhuong,
        xp.MaXaPhuong
      FROM dbo.KeHoachCongViec kh
      LEFT JOIN dbo.DanhMucCongViec dm ON kh.MaLoaiCongViec = dm.MaLoaiCongViec
      LEFT JOIN dbo.NguoiDung nl ON kh.NguoiLap = nl.MaNguoiDung
      LEFT JOIN dbo.NguoiDung xl ON kh.NguoiXuLy = xl.MaNguoiDung
      LEFT JOIN dbo.NguoiDung pd ON kh.NguoiPheDuyet = pd.MaNguoiDung
      LEFT JOIN dbo.TuyenDuong td ON kh.MaTuyenDuong = td.MaTuyenDuong
      LEFT JOIN dbo.XaPhuong xp ON td.MaXaPhuong = xp.MaXaPhuong
      ORDER BY kh.NgayCapNhat DESC, kh.NgayTao DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

  const countResult = await connection
    .request()
    .query(`SELECT COUNT(*) as total FROM dbo.KeHoachCongViec`);

  return {
    data: result.recordset,
    total: countResult.recordset[0].total,
    limit,
    offset,
  };
};

/**
 * Tìm kiếm kế hoạch phê duyệt với filter
 */
const searchKeHoachPheDuyet = async (filters) => {
  const {
    title,
    status,
    processor,
    xaPhuong,
    tuyenDuong,
    startDate,
    endDate,
    dateType,
    limit = 10,
    offset = 0,
  } = filters;

  const connection = await poolPromise;
  const request = connection.request();

  let query = `
    SELECT 
      kh.*,
      dm.TenCongViec,
      nl.HoTen AS TenNguoiLap,
      xl.HoTen AS TenNguoiXuLy,
      pd.HoTen AS TenNguoiPheDuyet,
      td.TenTuyenDuong,
      xp.TenXaPhuong,
      xp.MaXaPhuong
    FROM dbo.KeHoachCongViec kh
    LEFT JOIN dbo.DanhMucCongViec dm ON kh.MaLoaiCongViec = dm.MaLoaiCongViec
    LEFT JOIN dbo.NguoiDung nl ON kh.NguoiLap = nl.MaNguoiDung
    LEFT JOIN dbo.NguoiDung xl ON kh.NguoiXuLy = xl.MaNguoiDung
    LEFT JOIN dbo.NguoiDung pd ON kh.NguoiPheDuyet = pd.MaNguoiDung
    LEFT JOIN dbo.TuyenDuong td ON kh.MaTuyenDuong = td.MaTuyenDuong
    LEFT JOIN dbo.XaPhuong xp ON td.MaXaPhuong = xp.MaXaPhuong
    WHERE 1=1
  `;

  if (title) {
    query += ` AND kh.TieuDe LIKE @title`;
    request.input("title", sql.NVarChar, `%${title}%`);
  }

  if (status && status !== "Tất cả") {
    query += ` AND kh.TrangThai = @status`;
    request.input("status", sql.NVarChar, status);
  }

  if (processor) {
    query += ` AND (nl.HoTen LIKE @processor OR xl.HoTen LIKE @processor)`;
    request.input("processor", sql.NVarChar, `%${processor}%`);
  }

  if (xaPhuong) {
    query += ` AND xp.MaXaPhuong = @xaPhuong`;
    request.input("xaPhuong", sql.VarChar, xaPhuong);
  }

  if (tuyenDuong) {
    query += ` AND kh.MaTuyenDuong = @tuyenDuong`;
    request.input("tuyenDuong", sql.VarChar, tuyenDuong);
  }

  if (startDate && endDate) {
    const colName = dateType || "NgayTao";
    query += ` AND kh.${colName} BETWEEN @startDate AND @endDate`;
    request.input("startDate", sql.DateTime, new Date(startDate));
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    request.input("endDate", sql.DateTime, end);
  }

  const countQuery = `SELECT COUNT(*) as total FROM (` + query + `) AS T`;
  const countResult = await request.query(countQuery);

  query += ` ORDER BY kh.NgayCapNhat DESC, kh.NgayTao DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
  request.input("limit", sql.Int, parseInt(limit));
  request.input("offset", sql.Int, parseInt(offset));

  const result = await request.query(query);

  return {
    data: result.recordset,
    total: countResult.recordset[0].total,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

/**
 * Lấy chi tiết kế hoạch kèm KeHoachPhanCong và ChiTietPhanCong
 */
const getKeHoachChiTiet = async (maKeHoach) => {
  const connection = await poolPromise;

  // Lấy thông tin kế hoạch chính
  const keHoachResult = await connection
    .request()
    .input("maKeHoach", sql.NVarChar, maKeHoach)
    .query(`
      SELECT 
        kh.*,
        dm.TenCongViec,
        nl.HoTen AS TenNguoiLap,
        xl.HoTen AS TenNguoiXuLy,
        pd.HoTen AS TenNguoiPheDuyet,
        td.TenTuyenDuong,
        xp.TenXaPhuong,
        xp.MaXaPhuong
      FROM dbo.KeHoachCongViec kh
      LEFT JOIN dbo.DanhMucCongViec dm ON kh.MaLoaiCongViec = dm.MaLoaiCongViec
      LEFT JOIN dbo.NguoiDung nl ON kh.NguoiLap = nl.MaNguoiDung
      LEFT JOIN dbo.NguoiDung xl ON kh.NguoiXuLy = xl.MaNguoiDung
      LEFT JOIN dbo.NguoiDung pd ON kh.NguoiPheDuyet = pd.MaNguoiDung
      LEFT JOIN dbo.TuyenDuong td ON kh.MaTuyenDuong = td.MaTuyenDuong
      LEFT JOIN dbo.XaPhuong xp ON td.MaXaPhuong = xp.MaXaPhuong
      WHERE kh.MaKeHoach = @maKeHoach
    `);

  if (!keHoachResult.recordset[0]) return null;

  // Lấy danh sách KeHoachPhanCong
  let phanCongList = [];
  try {
    const phanCongResult = await connection
      .request()
      .input("maKeHoach2", sql.NVarChar, maKeHoach)
      .query(`
        SELECT 
          kpc.*,
          nl.HoTen AS TenNguoiTao,
          cu.HoTen AS TenNguoiCapNhat
        FROM dbo.KeHoachPhanCong kpc
        LEFT JOIN dbo.NguoiDung nl ON kpc.NguoiTao = nl.MaNguoiDung
        LEFT JOIN dbo.NguoiDung cu ON kpc.NguoiCapNhat = cu.MaNguoiDung
        WHERE kpc.MaKHCV = @maKeHoach2
        ORDER BY kpc.NgayTao DESC
      `);

    // Lấy ChiTietPhanCong cho từng KeHoachPhanCong
    for (const pc of phanCongResult.recordset) {
      const chiTietResult = await connection
        .request()
        .input("maKHPC", sql.NVarChar, pc.MaKHPC)
        .query(`
          SELECT 
            ctpc.*,
            cn.HoTen AS HoTenCongNhan
          FROM dbo.ChiTietPhanCong ctpc
          LEFT JOIN dbo.NguoiDung cn ON ctpc.MaCongNhan = cn.MaNguoiDung
          WHERE ctpc.MaKHPC = @maKHPC
          ORDER BY ctpc.ThoiGianBatDau ASC
        `);

      phanCongList.push({
        ...pc,
        chiTietList: chiTietResult.recordset,
      });
    }
  } catch (err) {
    console.log("Bỏ qua lỗi lấy phân công:", err.message);
  }

  return {
    keHoach: keHoachResult.recordset[0],
    phanCongList,
  };
};

/**
 * Cập nhật trạng thái và ý kiến phê duyệt
 */
const updateTrangThaiPheDuyet = async (maKeHoach, trangThai, yKienPheDuyet, nguoiPheDuyet, filePDFBoSungKeHoach, removeFiles = []) => {
  const connection = await poolPromise;
  const now = new Date();

  // Xử lý các cờ xóa file
  const removeBoSung = removeFiles.includes('FilePDFBoSungKeHoach') ? 1 : 0;
  const removeGoc = removeFiles.includes('FilePDFKeHoach') ? 1 : 0;
  const removeDeNghi = removeFiles.includes('FilePDFDeNghiCapPhep') ? 1 : 0;

  await connection
    .request()
    .input("maKeHoach", sql.NVarChar, maKeHoach)
    .input("trangThai", sql.NVarChar, trangThai)
    .input("yKienPheDuyet", sql.NVarChar, yKienPheDuyet || null)
    .input("nguoiPheDuyet", sql.NVarChar, nguoiPheDuyet || null)
    .input("filePDFBoSungKeHoach", sql.NVarChar, filePDFBoSungKeHoach || null)
    .input("ngayCapNhat", sql.DateTime, now)
    .input("ngayPheDuyet", sql.DateTime, now)
    .query(`
      UPDATE dbo.KeHoachCongViec
      SET 
        TrangThai = @trangThai,
        YKienPheDuyet = @yKienPheDuyet,
        NguoiPheDuyet = @nguoiPheDuyet,
        FilePDFBoSungKeHoach = CASE 
          WHEN ${removeBoSung} = 1 THEN NULL 
          ELSE 
            CASE 
              WHEN @filePDFBoSungKeHoach IS NOT NULL AND @filePDFBoSungKeHoach <> '' THEN 
                CASE 
                  WHEN FilePDFBoSungKeHoach IS NOT NULL AND FilePDFBoSungKeHoach <> '' THEN FilePDFBoSungKeHoach + ',' + @filePDFBoSungKeHoach
                  ELSE @filePDFBoSungKeHoach 
                END
              ELSE FilePDFBoSungKeHoach 
            END
        END,
        FilePDFKeHoach = CASE 
          WHEN ${removeGoc} = 1 THEN NULL 
          ELSE FilePDFKeHoach 
        END,
        FilePDFDeNghiCapPhep = CASE 
          WHEN ${removeDeNghi} = 1 THEN NULL 
          ELSE FilePDFDeNghiCapPhep 
        END,
        NgayCapNhat = @ngayCapNhat,
        NgayPheDuyet = @ngayPheDuyet
      WHERE MaKeHoach = @maKeHoach
    `);

  return { success: true };
};

const removeSpecificFile = async (maKeHoach, fileKey, fileName) => {
  const connection = await poolPromise;
  const allowedKeys = ['FilePDFKeHoach', 'FilePDFDeNghiCapPhep', 'FilePDFBoSungKeHoach'];
  
  if (!allowedKeys.includes(fileKey)) {
    throw new Error("Tên cột file không hợp lệ");
  }

  // Nếu không có fileName, xóa toàn bộ (cũ)
  if (!fileName) {
    await connection
      .request()
      .input("maKeHoach", sql.NVarChar, maKeHoach)
      .query(`UPDATE dbo.KeHoachCongViec SET ${fileKey} = NULL, NgayCapNhat = GETDATE() WHERE MaKeHoach = @maKeHoach`);
    return { success: true };
  }

  // Logic xóa 1 file khỏi chuỗi comma-separated
  await connection
    .request()
    .input("maKeHoach", sql.NVarChar, maKeHoach)
    .input("fileName", sql.NVarChar, fileName)
    .query(`
      UPDATE dbo.KeHoachCongViec
      SET ${fileKey} = CASE 
          WHEN ${fileKey} = @fileName THEN NULL
          WHEN ${fileKey} LIKE @fileName + ',%' THEN REPLACE(${fileKey}, @fileName + ',', '')
          WHEN ${fileKey} LIKE '%,' + @fileName THEN REPLACE(${fileKey}, ',' + @fileName, '')
          WHEN ${fileKey} LIKE '%,' + @fileName + ',%' THEN REPLACE(${fileKey}, ',' + @fileName + ',', ',')
          ELSE ${fileKey}
      END,
      NgayCapNhat = GETDATE()
      WHERE MaKeHoach = @maKeHoach
    `);

  return { success: true };
};

module.exports = {
  getAllKeHoachPheDuyet,
  searchKeHoachPheDuyet,
  getKeHoachChiTiet,
  updateTrangThaiPheDuyet,
  removeSpecificFile
};
