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
-- ==========================================
-- 2. NHÓM DANH MỤC & PHÂN QUYỀN
-- ==========================================
CREATE TABLE QuyenHan (
    MaQuyen VARCHAR(20) PRIMARY KEY,
    TenQuyenHan NVARCHAR(100),
    MoTa NVARCHAR(500),
    Slug VARCHAR(100),
    TenDanhMucCha NVARCHAR(100),
    Icon VARCHAR(MAX)
);

GO
CREATE TABLE VaiTro (
    MaVaiTro VARCHAR(10) PRIMARY KEY,
    TenVaiTro NVARCHAR(100),
    MoTa NVARCHAR(500),
    Slug VARCHAR(100),
    Icon VARCHAR(MAX)
);

GO
CREATE TABLE GanQuyen (
    MaVaiTro VARCHAR(10),
    MaQuyen VARCHAR(20),
    PRIMARY KEY (MaVaiTro, MaQuyen),
    CONSTRAINT FK_GanQuyen_VaiTro FOREIGN KEY (MaVaiTro) REFERENCES VaiTro (MaVaiTro),
    CONSTRAINT FK_GanQuyen_QuyenHan FOREIGN KEY (MaQuyen) REFERENCES QuyenHan (MaQuyen)
);

GO
CREATE TABLE XaPhuong (
    MaXaPhuong VARCHAR(20) PRIMARY KEY,
    MaHanhChinh INT,
    TenXaPhuong NVARCHAR(150),
    LoaiDanhMuc NVARCHAR(10)
);

GO
CREATE TABLE TuyenDuong (
    MaTuyenDuong VARCHAR(20) PRIMARY KEY,
    TenTuyenDuong NVARCHAR(150),
    TenVietTat VARCHAR(10), -- Phục vụ sinh mã cây tự động
    LoaiDuong NVARCHAR(50),
    MaXaPhuong VARCHAR(20) FOREIGN KEY REFERENCES XaPhuong (MaXaPhuong)
);

GO
CREATE TABLE NguoiDung (
    MaNguoiDung VARCHAR(20) PRIMARY KEY,
    TenDangNhap VARCHAR(17) UNIQUE,
    MatKhauHash VARCHAR(MAX),
    HoTen NVARCHAR(50),
    Email VARCHAR(254),
    SDT CHAR(10),
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
-- ==========================================
-- 3. NHÓM QUẢN LÝ CÂY XANH
-- ==========================================
CREATE TABLE DanhMucCayTrong (
    MaDMCay VARCHAR(20) PRIMARY KEY,
    TenCayTrong NVARCHAR(100),
    ChieuCaoTruongThanh DECIMAL(18, 2),
    DuongKinhTruongThanh DECIMAL(18, 2),
    HinhThucTanCay NVARCHAR(20),
    DangLa NVARCHAR(20),
    MauLa NVARCHAR(50),
    KyRungLa NVARCHAR(20),
    KyNoHoa NVARCHAR(20),
    MauHoa NVARCHAR(50),
    LoaiCay NVARCHAR(50),
    MoTa NVARCHAR(500),
    TrangThai NVARCHAR(50),
    NgayTao DATETIME DEFAULT GETDATE(),
    NgayCapNhat DATETIME
);

GO
CREATE TABLE CayXanh (
    MaCay VARCHAR(20) PRIMARY KEY,
    MaDMCay VARCHAR(20) FOREIGN KEY REFERENCES DanhMucCayTrong (MaDMCay),
    NgayTrong DATETIME,
    NguonGoc NVARCHAR(500),
    ChieuCaoHienTai DECIMAL(18, 2),
    DuongKinhThanHienTai DECIMAL(18, 2),
    DuongKinhTanHienTai DECIMAL(18, 2),
    TrangThaiSucKhoe NVARCHAR(50),
    KinhDo VARCHAR(100),
    ViDo VARCHAR(100),
    GhiChu NVARCHAR(MAX),
    NgayTao DATETIME DEFAULT GETDATE(),
    NgayCapNhat DATETIME,
    MaTuyenDuong VARCHAR(20) FOREIGN KEY REFERENCES TuyenDuong (MaTuyenDuong),
    MaNguoiCapNhat VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    CONSTRAINT CHK_CayXanh_KichThuoc CHECK (
        ChieuCaoHienTai >= 0
        AND DuongKinhThanHienTai >= 0
    )
);

GO
CREATE TABLE DanhMucCongViec (
    MaLoaiCongViec VARCHAR(20) PRIMARY KEY,
    TenCongViec NVARCHAR(150),
    MoTaCV NVARCHAR(500)
);

GO
-- ==========================================
-- 4. NHÓM KẾ HOẠCH & PHÂN CÔNG
-- ==========================================
CREATE TABLE KeHoachCongViec (
    MaKeHoach VARCHAR(20) PRIMARY KEY,
    MaLoaiCongViec VARCHAR(20) FOREIGN KEY REFERENCES DanhMucCongViec (MaLoaiCongViec),
    TieuDe NVARCHAR(200),
    MoTa NVARCHAR(500),
    FilePDFKeHoach VARCHAR(MAX),
    FilePDFDeNghiCapPhep VARCHAR(MAX),
    NguoiLap VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    TrangThai NVARCHAR(50),
    FilePDFBoSungKeHoach VARCHAR(MAX),
    YKienPheDuyet NVARCHAR(200),
    NguoiPheDuyet VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayPheDuyet DATETIME,
    NgayTao DATETIME DEFAULT GETDATE(),
    NgayCapNhat DATETIME,
    NguoiXuLy VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayXuLy DATETIME,
    MaTuyenDuong VARCHAR(20) FOREIGN KEY REFERENCES TuyenDuong (MaTuyenDuong)
);

-- Thêm ràng buộc và giá trị mặc định cho TrangThai của KeHoachCongViec
ALTER TABLE KeHoachCongViec
ADD CONSTRAINT DF_KeHoach_TrangThai DEFAULT N'Đã gửi' FOR TrangThai;

ALTER TABLE KeHoachCongViec
ADD CONSTRAINT CK_KeHoach_TrangThai CHECK (
    TrangThai IN (
        N'Đã gửi',
        N'Đang thẩm định',
        N'Đã phê duyệt',
        N'Bị từ chối',
        N'Đã hủy'
    )
);

GO
CREATE TABLE KeHoachPhanCong (
    MaKHPC VARCHAR(20) PRIMARY KEY,
    MaKHCV VARCHAR(20) FOREIGN KEY REFERENCES KeHoachCongViec (MaKeHoach),
    TieuDe NVARCHAR(150),
    FilePDF VARCHAR(MAX),
    NguoiTao VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayTao DATETIME DEFAULT GETDATE(),
    NguoiCapNhat VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayCapNhat DATETIME,
    TrangThaiNghiemThu NVARCHAR(100),
    NgayNghiemThu DATETIME,
    NguoiNghiemThu VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    YKienNghiemThu NVARCHAR(500)
);

GO
CREATE TABLE ChiTietPhanCong (
    MaChiTiet VARCHAR(20) PRIMARY KEY,
    MaKHPC VARCHAR(20) FOREIGN KEY REFERENCES KeHoachPhanCong (MaKHPC),
    MaCongNhan VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    CongViecCuThe NVARCHAR(500),
    ThoiGianBatDau DATETIME,
    ThoiGianKetThuc DATETIME,
    XacNhanLam BIT DEFAULT 0,
    LyDo NVARCHAR(500),
    AnhTruocPhanCong VARCHAR(20),
    AnhSauPhanCong VARCHAR(20),
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
    MaChiTietPhanCong VARCHAR(20) FOREIGN KEY REFERENCES ChiTietPhanCong (MaChiTiet),
    DuongDanAnh VARCHAR(MAX),
    MoTa NVARCHAR(150),
    NgayUpload DATETIME DEFAULT GETDATE()
);

GO
CREATE TABLE AnhSauPhanCong (
    MaAnhSau VARCHAR(20) PRIMARY KEY,
    MaChiTietPhanCong VARCHAR(20) FOREIGN KEY REFERENCES ChiTietPhanCong (MaChiTiet),
    DuongDanAnh VARCHAR(MAX),
    MoTa NVARCHAR(150),
    NgayUpload DATETIME DEFAULT GETDATE()
);

GO
-- ==========================================
-- 5. NHÓM BÁO CÁO & LƯU TRỮ
-- ==========================================
CREATE TABLE BaoCaoSuCo (
    MaBaoCao VARCHAR(20) PRIMARY KEY,
    MaNguoiBaoCao VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    ThoiGianBaoCao DATETIME,
    MaXaPhuong VARCHAR(20) FOREIGN KEY REFERENCES XaPhuong (MaXaPhuong),
    DiaChiCuThe NVARCHAR(100),
    LoaiPhanAnh NVARCHAR(500),
    TrangThaiXuLy NVARCHAR(50),
    MaNguoiXuLy VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    TraLoiPhanHoi NVARCHAR(500),
    PDFDinhKemXuLy VARCHAR(MAX),
    NgayTao DATETIME DEFAULT GETDATE(),
    NgayCapNhat DATETIME
);

GO
CREATE TABLE ChiTietBaoCao (
    MaChiTietBaoCao VARCHAR(20) PRIMARY KEY,
    MaBaoCao VARCHAR(20) FOREIGN KEY REFERENCES BaoCaoSuCo (MaBaoCao),
    MaCay VARCHAR(20) FOREIGN KEY REFERENCES CayXanh (MaCay),
    MaTuyenDuong VARCHAR(20) FOREIGN KEY REFERENCES TuyenDuong (MaTuyenDuong),
    MoTaTìnhTrang NVARCHAR(500),
    MucDoNguyHiem NVARCHAR(50),
    DaXuLy BIT DEFAULT 0,
    CONSTRAINT CHK_MucDoNguyHiem CHECK (
        MucDoNguyHiem IN (N'Thấp', N'Trung bình', N'Cao', N'Khẩn cấp')
    )
);

GO
CREATE TABLE HinhAnhBaoCao (
    MaHinhAnh VARCHAR(20) PRIMARY KEY,
    MaChiTietBaoCao VARCHAR(20) FOREIGN KEY REFERENCES ChiTietBaoCao (MaChiTietBaoCao),
    DuongDanHinh VARCHAR(MAX),
    MoTaHinh NVARCHAR(100),
    NgayUpload DATETIME DEFAULT GETDATE()
);

GO
CREATE TABLE HoSoLuuTruNghiemThu (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    MaLoaiCongViec VARCHAR(20) FOREIGN KEY REFERENCES DanhMucCongViec (MaLoaiCongViec),
    TieuDe NVARCHAR(150),
    MoTa NVARCHAR(500),
    FilePDF VARCHAR(MAX),
    NguoiTao VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayTao DATETIME DEFAULT GETDATE(),
    NguoiCapNhat VARCHAR(20) FOREIGN KEY REFERENCES NguoiDung (MaNguoiDung),
    NgayCapNhat DATETIME,
    MaTuyenDuong VARCHAR(20) FOREIGN KEY REFERENCES TuyenDuong (MaTuyenDuong)
);

GO