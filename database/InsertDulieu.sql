USE QuanLyCayXanhDN;
GO

-- ==========================================
-- 1. THÊM DỮ LIỆU QUYỀN HẠN
-- ==========================================
INSERT INTO QuyenHan (MaQuyen, TenQuyenHan, MoTa, Slug, TenDanhMucCha, Icon) VALUES
('DN', N'Đăng nhập', N'Quyền đăng nhập vào hệ thống', 'dang-nhap', N'Hệ thống', NULL),
('TDTTKH', N'Theo dõi trạng thái kế hoạch', N'Quyền theo dõi tiến độ và trạng thái các kế hoạch', 'theo-doi-trang-thai-ke-hoach', N'Quản lý kế hoạch', NULL),
('GKHCV', N'Gửi kế hoạch công việc', N'Quyền tạo và gửi đề xuất kế hoạch công việc', 'gui-ke-hoach-cong-viec', N'Quản lý kế hoạch', NULL),
('PDKH', N'Phê duyệt kế hoạch', N'Quyền xem xét và phê duyệt kế hoạch', 'phe-duyet-ke-hoach', N'Quản lý kế hoạch', NULL),
('XBCTKKH', N'Xem báo cáo và thống kê kế hoạch', N'Quyền xem các báo cáo và thống kê liên quan đến kế hoạch', 'xem-bao-cao-thong-ke', N'Báo cáo thống kê', NULL);
GO

-- ==========================================
-- 2. THÊM DỮ LIỆU VAI TRÒ
-- ==========================================
INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa, Slug, Icon) VALUES
('QTHT', N'Quản trị hệ thống', N'Quản lý toàn bộ hệ thống, người dùng và phân quyền', 'quan-tri-he-thong', NULL),
('CBQL', N'Cán bộ quản lý', N'Quản lý, phê duyệt kế hoạch và xem báo cáo', 'can-bo-quan-ly', NULL),
('NVKT', N'Nhân viên kỹ thuật', N'Lập và theo dõi kế hoạch công việc', 'nhan-vien-ky-thuat', NULL),
('CNCX', N'Công nhân cây xanh', N'Thực hiện các công việc ngoài hiện trường', 'cong-nhan-cay-xanh', NULL),
('ND', N'Người dân', N'Người dân tra cứu thông tin, gửi phản ánh', 'nguoi-dan', NULL);
GO

-- ==========================================
-- 3. THÊM DỮ LIỆU GÁN QUYỀN
-- ==========================================
INSERT INTO GanQuyen (MaVaiTro, MaQuyen) VALUES
('NVKT', 'TDTTKH'), -- Nhân viên kỹ thuật: Theo dõi trạng thái kế hoạch
('NVKT', 'GKHCV'), -- Nhân viên kỹ thuật: Gửi kế hoạch công việc
('CBQL', 'PDKH'), -- Cán bộ quản lý: Phê duyệt kế hoạch
('CBQL', 'XBCTKKH'); -- Cán bộ quản lý: Xem báo cáo và thống kê kế hoạch
GO

-- ==========================================
-- 4. THÊM DỮ LIỆU XÃ PHƯỜNG & TUYẾN ĐƯỜNG (ĐÀ NẴNG)
-- ==========================================
-- Dữ liệu Xã/Phường thuộc Quận Hải Châu, TP. Đà Nẵng
INSERT INTO XaPhuong (MaXaPhuong, MaHanhChinh, TenXaPhuong, LoaiDanhMuc) VALUES
('PTT', 20101, N'Phường Thạch Thang', N'Phường'),
('PHCI', 20102, N'Phường Hải Châu I', N'Phường'),
('PHCII', 20103, N'Phường Hải Châu II', N'Phường'),
('PPN', 20104, N'Phường Phước Ninh', N'Phường'),
('PHTT', 20105, N'Phường Hòa Thuận Tây', N'Phường');
GO

-- Dữ liệu Tuyến Đường tại Đà Nẵng
INSERT INTO TuyenDuong (MaTuyenDuong, TenTuyenDuong, TenVietTat, LoaiDuong, MaXaPhuong) VALUES
('LD', N'Lê Duẩn', 'LD', N'Đường chính', 'PTT'),
('NVL', N'Nguyễn Văn Linh', 'NVL', N'Đường chính', 'PPN'),
('BD', N'Bạch Đằng', 'BD', N'Đường ven sông', 'PHCI'),
('TP', N'Trần Phú', 'TP', N'Đường chính', 'PHCI'),
('HV', N'Hùng Vương', 'HV', N'Đường chính', 'PHCII');
GO

-- ==========================================
-- 5. THÊM DỮ LIỆU NGƯỜI DÙNG
-- ==========================================
INSERT INTO NguoiDung (MaNguoiDung, TenDangNhap, MatKhauHash, HoTen, Email, SDT, MaTuyenDuong, DiaChi, NgayTao, NgayCapNhat, MaVaiTro) VALUES
('aB3kL9pQx2mV8nZ1cY5t', 'cbquanly', 'e10adc3949ba59abbe56e057f20f883e', N'Nguyễn Văn Quản Lý', 'quanly@danang.gov.vn', '0901234567', 'LD', N'123 Lê Duẩn, Đà Nẵng', GETDATE(), NULL, 'CBQL'),
('m3Lp8Qz1xK5vB9cJ2hF4', 'nvkythuat', 'e10adc3949ba59abbe56e057f20f883e', N'Trần Thị Kỹ Thuật', 'kythuat@danang.gov.vn', '0987654321', 'NVL', N'456 Nguyễn Văn Linh, Đà Nẵng', GETDATE(), NULL, 'NVKT');
GO

-- ==========================================
-- 6. THÊM DỮ LIỆU DANH MỤC CÔNG VIỆC
-- ==========================================
INSERT INTO DanhMucCongViec (MaLoaiCongViec, TenCongViec, MoTaCV) VALUES
('TM', N'Trồng mới', N'Công tác trồng mới cây xanh'),
('CS', N'Chăm sóc', N'Công tác chăm sóc, tưới nước, bón phân, cắt tỉa'),
('DDCH', N'Di dời / Chặt hạ', N'Công tác di dời cây hoặc chặt hạ cây nguy hiểm, chết'),
('XLSC', N'Xử lý sự cố', N'Xử lý các sự cố cây gãy, đổ do mưa bão hoặc nguyên nhân khác');
GO

-- ==========================================
-- 7. THÊM DỮ LIỆU KẾ HOẠCH CÔNG VIỆC
-- ==========================================
INSERT INTO KeHoachCongViec (MaKeHoach, MaLoaiCongViec, TieuDe, MoTa, FilePDFKeHoach, FilePDFDeNghiCapPhep, NguoiLap, TrangThai, FilePDFBoSungKeHoach, YKienPheDuyet, NguoiPheDuyet, NgayPheDuyet, NgayTao, NgayCapNhat, NguoiXuLy, NgayXuLy, MaTuyenDuong) VALUES
('KH01', 'CS', N'Kế hoạch chăm sóc cây tuyến Lê Duẩn', N'Thực hiện cắt tỉa cành vươn, bón phân định kỳ', NULL, NULL, 'm3Lp8Qz1xK5vB9cJ2hF4', N'Đã phê duyệt', NULL, N'Đồng ý triển khai theo kế hoạch', 'aB3kL9pQx2mV8nZ1cY5t', GETDATE(), GETDATE(), NULL, 'm3Lp8Qz1xK5vB9cJ2hF4', GETDATE(), 'LD'),
('KH02', 'TM', N'Kế hoạch trồng dặm cây tuyến Nguyễn Văn Linh', N'Trồng dặm bổ sung các vị trí cây xanh bị khuyết', NULL, NULL, 'm3Lp8Qz1xK5vB9cJ2hF4', N'Đang chờ duyệt', NULL, NULL, NULL, NULL, GETDATE(), NULL, NULL, NULL, 'NVL');
GO
