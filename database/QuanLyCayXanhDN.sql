USE master;

GO
-- ==========================================
-- 1. KIỂM TRA VÀ TẠO DATABASE
-- ==========================================
IF EXISTS (
    SELECT
        name
    FROM
        sys.databases
    WHERE
        name = N'QuanLyCayXanhDN'
) BEGIN
ALTER DATABASE QuanLyCayXanhDN
SET
    SINGLE_USER
WITH
    ROLLBACK IMMEDIATE;

DROP DATABASE QuanLyCayXanhDN;

END
GO
CREATE DATABASE QuanLyCayXanhDN;

GO
USE QuanLyCayXanhDN;

GO
-- Thiết lập ngôn ngữ và định dạng ngày giờ Việt Nam cho toàn cục session
SET DATEFORMAT dmy;

GO
-- ==========================================
-- 2. NHÓM DANH MỤC & PHÂN QUYỀN
-- ==========================================
CREATE TABLE QuyenHan (
    MaQuyen VARCHAR(20) PRIMARY KEY,
    TenQuyenHan NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(500),
    Slug VARCHAR(100) NOT NULL,
    TenDanhMucCha NVARCHAR(100),
    Icon VARCHAR(MAX)
);

GO
CREATE TABLE VaiTro (
    MaVaiTro VARCHAR(10) PRIMARY KEY,
    TenVaiTro NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(500),
    Slug VARCHAR(100) NOT NULL,
    Icon VARCHAR(MAX)
);

GO
CREATE TABLE GanQuyen (
    MaVaiTro VARCHAR(10) NOT NULL,
    MaQuyen VARCHAR(20) NOT NULL,
    PRIMARY KEY (MaVaiTro, MaQuyen),
    CONSTRAINT FK_GanQuyen_VaiTro FOREIGN KEY (MaVaiTro) REFERENCES VaiTro (MaVaiTro),
    CONSTRAINT FK_GanQuyen_QuyenHan FOREIGN KEY (MaQuyen) REFERENCES QuyenHan (MaQuyen)
);

GO
CREATE TABLE XaPhuong (
    MaXaPhuong VARCHAR(20) PRIMARY KEY,
    MaHanhChinh INT,
    TenXaPhuong NVARCHAR(150) NOT NULL,
    LoaiDanhMuc NVARCHAR(10) NOT NULL,
    CONSTRAINT CHK_XaPhuong_LoaiDanhMuc CHECK (LoaiDanhMuc IN (N'Xã', N'Phường'))
);

GO
CREATE TABLE TuyenDuong (
    MaTuyenDuong VARCHAR(20) PRIMARY KEY,
    TenTuyenDuong NVARCHAR(150) NOT NULL,
    TenVietTat VARCHAR(10) NOT NULL,
    LoaiDuong NVARCHAR(50) NOT NULL,
    MaXaPhuong VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES XaPhuong (MaXaPhuong),
    CONSTRAINT CHK_TuyenDuong_LoaiDuong CHECK (LoaiDuong IN (N'Đường lớn', N'đường nhánh', N'ngõ', N'hẻm'))
);
GO

GO
CREATE TABLE NguoiDung (
    MaNguoiDung VARCHAR(20) PRIMARY KEY,
    TenDangNhap VARCHAR(17) UNIQUE NOT NULL,
    MatKhauHash VARCHAR(MAX) NOT NULL,
    HoTen NVARCHAR(50),
    Email VARCHAR(254) NOT NULL UNIQUE,
    SDT CHAR(10) NOT NULL UNIQUE,
    MaTuyenDuong VARCHAR(20) FOREIGN KEY REFERENCES TuyenDuong (MaTuyenDuong),
    DiaChi NVARCHAR(100),
    NgayTao DATETIME DEFAULT GETDATE(),
    NgayCapNhat DATETIME,
    MaVaiTro VARCHAR(10) FOREIGN KEY REFERENCES VaiTro (MaVaiTro),
    CONSTRAINT CHK_NguoiDung_Email CHECK (Email LIKE '%@%._%'),
    CONSTRAINT CHK_NguoiDung_SDT CHECK (
        ISNUMERIC(SDT) = 1
        AND LEN(SDT) >= 10
    )
);

GO
-- Bổ sung thuộc tính sau khi tạo bảng
ALTER TABLE NguoiDung ADD AnhDaiDien VARCHAR(MAX);

GO
-- ==========================================
-- 3. NHÓM QUẢN LÝ CÂY XANH
-- ==========================================
CREATE TABLE DanhMucCayTrong (
    MaDMCay VARCHAR(20) PRIMARY KEY,
    TenCayTrong NVARCHAR(100) NOT NULL,
    ChieuCaoTruongThanh DECIMAL(18, 2) NOT NULL,
    DuongKinhTruongThanh DECIMAL(18, 2) NOT NULL,
    HinhThucTanCay NVARCHAR(20) NOT NULL,
    DangLa NVARCHAR(20) NOT NULL,
    MauLa NVARCHAR(50) NOT NULL,
    KyRungLa NVARCHAR(20),
    KyNoHoa NVARCHAR(20),
    MauHoa NVARCHAR(50),
    LoaiCay NVARCHAR(50) NOT NULL,
    MoTa NVARCHAR(500),
    TrangThai NVARCHAR(50) NOT NULL,
    NgayTao DATETIME DEFAULT GETDATE(),
    NgayCapNhat DATETIME,

    -- Ràng buộc kiểm tra giá trị cột
    CONSTRAINT CHK_HinhThucTanCay CHECK (HinhThucTanCay IN (N'Tự do', N'tròn', N'trứng', N'thuỗn', N'tháp', N'phân tầng', N'rù')),
    CONSTRAINT CHK_DangLa CHECK (DangLa IN (N'bản', N'kim')),
    CONSTRAINT CHK_LoaiCay CHECK (LoaiCay IN (N'Tiểu mộc', N'đại mộc', N'trung mộc')),
    CONSTRAINT CHK_TrangThai CHECK (TrangThai IN (N'Được phép trồng', N'không được phép trồng'))
);

GO
CREATE TABLE CayXanh (
    MaCay VARCHAR(20) PRIMARY KEY,
    MaDMCay VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES DanhMucCayTrong (MaDMCay),
    NgayTrong DATETIME,
    NguonGoc NVARCHAR(500),
    ChieuCaoHienTai DECIMAL(18, 2),
    DuongKinhThanHienTai DECIMAL(18, 2),
    DuongKinhTanHienTai DECIMAL(18, 2),
    TrangThaiSucKhoe NVARCHAR(50) DEFAULT N'Bình thường',
    KinhDo VARCHAR(100) NOT NULL,
    ViDo VARCHAR(100) NOT NULL,
    GhiChu NVARCHAR(MAX),
    NgayTao DATETIME DEFAULT GETDATE(),
    NgayCapNhat DATETIME,
    MaTuyenDuong VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES TuyenDuong (MaTuyenDuong),
    MaNguoiCapNhat VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    CONSTRAINT CHK_CayXanh_KichThuoc CHECK (
        ChieuCaoHienTai >= 0
        AND DuongKinhThanHienTai >= 0
    ),
    CONSTRAINT CHK_CayXanh_TrangThaiSucKhoe CHECK (
        TrangThaiSucKhoe IN (N'Bình thường', N'nguy hiểm thấp', N'nguy hiểm trung bình', N'nguy hiểm cao', N'khẩn cấp')
    )
);

GO
CREATE TABLE DanhMucCongViec (
    MaLoaiCongViec VARCHAR(20) PRIMARY KEY,
    TenCongViec NVARCHAR(150) NOT NULL,
    MoTaCV NVARCHAR(500)
);

GO
-- ==========================================
-- 4. NHÓM KẾ HOẠCH & PHÂN CÔNG
-- ==========================================
CREATE TABLE KeHoachCongViec (
    MaKeHoach VARCHAR(20) PRIMARY KEY,
    MaLoaiCongViec VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES DanhMucCongViec (MaLoaiCongViec),
    TieuDe NVARCHAR(200) NOT NULL,
    MoTa NVARCHAR(500),
    FilePDFKeHoach VARCHAR(MAX) NOT NULL,
    FilePDFDeNghiCapPhep VARCHAR(MAX) NOT NULL,
    NguoiLap VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    TrangThai NVARCHAR(50) DEFAULT N'Đã gửi',
    FilePDFBoSungKeHoach VARCHAR(MAX),
    YKienPheDuyet NVARCHAR(200),
    NguoiPheDuyet VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayPheDuyet DATETIME,
    NgayTao DATETIME DEFAULT GETDATE(),
    NgayCapNhat DATETIME,
    NguoiXuLy VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayXuLy DATETIME,
    MaTuyenDuong VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES TuyenDuong (MaTuyenDuong),
    CONSTRAINT CK_KeHoach_TrangThai CHECK (
        TrangThai IN (N'Đã gửi', N'Đang thẩm định', N'Đã phê duyệt', N'Bị từ chối', N'Đã hủy')
    )
);

GO
CREATE TABLE KeHoachPhanCong (
    MaKHPC VARCHAR(20) PRIMARY KEY,
    MaKHCV VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES KeHoachCongViec (MaKeHoach),
    TieuDe NVARCHAR(150) NOT NULL,
    FilePDF VARCHAR(MAX) NOT NULL,
    NguoiTao VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayTao DATETIME DEFAULT GETDATE(),
    NguoiCapNhat VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayCapNhat DATETIME,
    TrangThaiNghiemThu NVARCHAR(100) DEFAULT N'Chưa nghiệm thu',
    NgayNghiemThu DATETIME,
    NguoiNghiemThu VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    YKienNghiemThu NVARCHAR(500),

    CONSTRAINT CK_KeHoachPhanCong_TrangThaiNghiemThu CHECK (
        TrangThaiNghiemThu IN (N'Chưa nghiệm thu', N'đang nghiệm thu', N'Đang nghiệm thu', N'Không đạt yêu cầu')
    )
);

GO
CREATE TABLE ChiTietPhanCong (
    MaChiTiet VARCHAR(20) PRIMARY KEY,
    MaKHPC VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES KeHoachPhanCong (MaKHPC),
    MaCongNhan VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    CongViecCuThe NVARCHAR(500) NOT NULL,
    ThoiGianBatDau DATETIME NOT NULL,
    ThoiGianKetThuc DATETIME NOT NULL,
    XacNhanLam BIT DEFAULT 0,
    LyDo NVARCHAR(500),
    KhoiLuongHoanThanh NVARCHAR(100),
    XacNhanHoanTat BIT DEFAULT 0,
    NgayCapNhat DATETIME,
    DanhGia NVARCHAR(500),
    YeuCauLamLai BIT DEFAULT 0,
    LyDoYeuCauLamLai NVARCHAR(500),
    KetQuaNghiemThuChiTiet NVARCHAR(500),
    NguoiDanhGia VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayDanhGia DATETIME,
    CONSTRAINT CHK_ThoiGianLamViec CHECK (ThoiGianKetThuc >= ThoiGianBatDau)
);

GO
CREATE TABLE AnhTruocPhanCong (
    MaAnhTruoc VARCHAR(20) PRIMARY KEY,
    MaChiTietPhanCong VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES ChiTietPhanCong (MaChiTiet),
    DuongDanAnh VARCHAR(MAX) NOT NULL,
    MoTa NVARCHAR(150),
    NgayUpload DATETIME DEFAULT GETDATE()
);

GO
CREATE TABLE AnhSauPhanCong (
    MaAnhSau VARCHAR(20) PRIMARY KEY,
    MaChiTietPhanCong VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES ChiTietPhanCong (MaChiTiet),
    DuongDanAnh VARCHAR(MAX) NOT NULL,
    MoTa NVARCHAR(150),
    NgayUpload DATETIME DEFAULT GETDATE()
);

GO
-- ==========================================
-- 5. NHÓM BÁO CÁO & LƯU TRỮ
-- ==========================================
CREATE TABLE BaoCaoSuCo (
    MaBaoCao VARCHAR(20) PRIMARY KEY,
    MaNguoiBaoCao VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    ThoiGianBaoCao DATETIME DEFAULT GETDATE(),
    MaXaPhuong VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES XaPhuong (MaXaPhuong),
    DiaChiCuThe NVARCHAR(100) NOT NULL,
    LoiPhanAnh NVARCHAR(500) NOT NULL,
    TrangThaiXuLy NVARCHAR(50) DEFAULT N'Chờ xử lý',
    MaNguoiXuLy VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    TraLoiPhanHoi NVARCHAR(500),
    PDFDinhKemXuLy VARCHAR(MAX),
    NgayTao DATETIME DEFAULT GETDATE(),
    NgayCapNhat DATETIME,

    CONSTRAINT CK_BaoCaoSuCo_TrangThaiXuLy CHECK (
        TrangThaiXuLy IN (N'Chờ xử lý', N'đang xử lý', N'đã xử lý', N'bị từ chối', N'đã hủy')
    )
);

GO
CREATE TABLE ChiTietBaoCao (
    MaChiTietBaoCao VARCHAR(20) PRIMARY KEY,
    MaBaoCao VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES BaoCaoSuCo (MaBaoCao),
    MaCay VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES CayXanh (MaCay),
    MaTuyenDuong VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES TuyenDuong (MaTuyenDuong),
    MoTaTìnhTrang NVARCHAR(500) NOT NULL,
    MucDoNguyHiem NVARCHAR(50) NOT NULL,
    DaXuLy BIT DEFAULT 0,
    CONSTRAINT CHK_MucDoNguyHiem CHECK (
        MucDoNguyHiem IN (N'Thấp', N'Trung bình', N'Cao', N'Khẩn cấp')
    )
);

GO
CREATE TABLE HinhAnhBaoCao (
    MaHinhAnh VARCHAR(20) PRIMARY KEY,
    MaChiTietBaoCao VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES ChiTietBaoCao (MaChiTietBaoCao),
    DuongDanHinh VARCHAR(MAX) NOT NULL,
    MoTaHinh NVARCHAR(100),
    NgayUpload DATETIME DEFAULT GETDATE()
);

GO
CREATE TABLE HoSoLuuTruNghiemThu (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    MaLoaiCongViec VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES DanhMucCongViec (MaLoaiCongViec),
    TieuDe NVARCHAR(150) NOT NULL,
    MoTa NVARCHAR(500),
    FilePDF VARCHAR(MAX) NOT NULL,
    NguoiTao VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayTao DATETIME DEFAULT GETDATE(),
    NguoiCapNhat VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayCapNhat DATETIME,
    MaTuyenDuong VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES TuyenDuong (MaTuyenDuong)
);

GO
