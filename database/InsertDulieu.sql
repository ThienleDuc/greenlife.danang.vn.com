USE QuanLyCayXanhDN;

GO
-- ==========================================
-- 1. THÊM DỮ LIỆU QUYỀN HẠN
-- ==========================================
INSERT INTO
    QuyenHan (
        MaQuyen,
        TenQuyenHan,
        MoTa,
        Slug,
        TenDanhMucCha,
        Icon
    )
VALUES
    (
        'DN',
        N'Đăng nhập',
        N'Quyền đăng nhập vào hệ thống',
        'dang-nhap',
        N'Hệ thống',
        NULL
    ),
    (
        'TDTTKH',
        N'Theo dõi trạng thái kế hoạch',
        N'Quyền theo dõi tiến độ và trạng thái các kế hoạch',
        'theo-doi-trang-thai-ke-hoach',
        N'Quản lý kế hoạch',
        NULL
    ),
    (
        'GKHCV',
        N'Gửi kế hoạch công việc',
        N'Quyền tạo và gửi đề xuất kế hoạch công việc',
        'gui-ke-hoach-cong-viec',
        N'Quản lý kế hoạch',
        NULL
    ),
    (
        'PDKH',
        N'Phê duyệt kế hoạch',
        N'Quyền xem xét và phê duyệt kế hoạch',
        'phe-duyet-ke-hoach',
        N'Quản lý kế hoạch',
        NULL
    ),
    (
        'XBCTKKH',
        N'Xem báo cáo và thống kê kế hoạch',
        N'Quyền xem các báo cáo và thống kê liên quan đến kế hoạch',
        'xem-bao-cao-thong-ke',
        N'Báo cáo thống kê',
        NULL
    );

GO
-- ==========================================
-- 2. THÊM DỮ LIỆU VAI TRÒ
-- ==========================================
INSERT INTO
    VaiTro (MaVaiTro, TenVaiTro, MoTa, Slug, Icon)
VALUES
    (
        'QTHT',
        N'Quản trị hệ thống',
        N'Quản lý toàn bộ hệ thống, người dùng và phân quyền',
        'quan-tri-he-thong',
        NULL
    ),
    (
        'CBQL',
        N'Cán bộ quản lý',
        N'Quản lý, phê duyệt kế hoạch và xem báo cáo',
        'can-bo-quan-ly',
        NULL
    ),
    (
        'NVKT',
        N'Nhân viên kỹ thuật',
        N'Lập và theo dõi kế hoạch công việc',
        'nhan-vien-ky-thuat',
        NULL
    ),
    (
        'CNCX',
        N'Công nhân cây xanh',
        N'Thực hiện các công việc ngoài hiện trường',
        'cong-nhan-cay-xanh',
        NULL
    ),
    (
        'ND',
        N'Người dân',
        N'Người dân tra cứu thông tin, gửi phản ánh',
        'nguoi-dan',
        NULL
    );

GO
-- ==========================================
-- 3. THÊM DỮ LIỆU GÁN QUYỀN
-- ==========================================
INSERT INTO
    GanQuyen (MaVaiTro, MaQuyen)
VALUES
    ('NVKT', 'TDTTKH'), -- Nhân viên kỹ thuật: Theo dõi trạng thái kế hoạch
    ('NVKT', 'GKHCV'), -- Nhân viên kỹ thuật: Gửi kế hoạch công việc
    ('CBQL', 'PDKH'), -- Cán bộ quản lý: Phê duyệt kế hoạch
    ('CBQL', 'XBCTKKH');

-- Cán bộ quản lý: Xem báo cáo và thống kê kế hoạch
GO
-- ==========================================
-- 4. THÊM DỮ LIỆU XÃ PHƯỜNG & TUYẾN ĐƯỜNG (ĐÀ NẴNG)
-- ==========================================
-- Dữ liệu Xã/Phường thuộc Quận Hải Châu, TP. Đà Nẵng
INSERT INTO
    XaPhuong (MaXaPhuong, MaHanhChinh, TenXaPhuong, LoaiDanhMuc)
VALUES
    ('PTT', 20101, N'Phường Thạch Thang', N'Phường'),
    ('PHCI', 20102, N'Phường Hải Châu I', N'Phường'),
    ('PHCII', 20103, N'Phường Hải Châu II', N'Phường'),
    ('PPN', 20104, N'Phường Phước Ninh', N'Phường'),
    ('PHTT', 20105, N'Phường Hòa Thuận Tây', N'Phường');

GO
-- Dữ liệu Tuyến Đường tại Đà Nẵng
INSERT INTO
    TuyenDuong (
        MaTuyenDuong,
        TenTuyenDuong,
        TenVietTat,
        LoaiDuong,
        MaXaPhuong
    )
VALUES
    ('LD', N'Lê Duẩn', 'LD', N'Đường chính', 'PTT'),
    (
        'NVL',
        N'Nguyễn Văn Linh',
        'NVL',
        N'Đường chính',
        'PPN'
    ),
    (
        'BD',
        N'Bạch Đằng',
        'BD',
        N'Đường ven sông',
        'PHCI'
    ),
    ('TP', N'Trần Phú', 'TP', N'Đường chính', 'PHCI'),
    (
        'HV',
        N'Hùng Vương',
        'HV',
        N'Đường chính',
        'PHCII'
    );

GO
-- ==========================================
-- 5. THÊM DỮ LIỆU NGƯỜI DÙNG
-- ==========================================
INSERT INTO
    NguoiDung (
        MaNguoiDung,
        TenDangNhap,
        MatKhauHash,
        HoTen,
        Email,
        SDT,
        MaTuyenDuong,
        DiaChi,
        NgayTao,
        NgayCapNhat,
        MaVaiTro
    )
VALUES
    (
        'm3Lp8Qz1xK5vB9cJ2hF4',
        'cbquanly',
        'e10adc3949ba59abbe56e057f20f883e',
        N'Nguyễn Văn Quản Lý',
        'quanly@danang.gov.vn',
        '0901234567',
        'LD',
        N'123 Lê Duẩn, Đà Nẵng',
        GETDATE(),
        NULL,
        'CBQL'
    ),
    (
        'aB3kL9pQx2mV8nZ1cY5t',
        'nvkythuat',
        'e10adc3949ba59abbe56e057f20f883e',
        N'Trần Thị Kỹ Thuật',
        'kythuat@danang.gov.vn',
        '0987654321',
        'NVL',
        N'456 Nguyễn Văn Linh, Đà Nẵng',
        GETDATE(),
        NULL,
        'NVKT'
    );

GO
-- ==========================================
-- 6. THÊM DỮ LIỆU DANH MỤC CÔNG VIỆC
-- ==========================================
INSERT INTO
    DanhMucCongViec (MaLoaiCongViec, TenCongViec, MoTaCV)
VALUES
    (
        'TM',
        N'Trồng mới',
        N'Công tác trồng mới cây xanh'
    ),
    (
        'CS',
        N'Chăm sóc',
        N'Công tác chăm sóc, tưới nước, bón phân, cắt tỉa'
    ),
    (
        'DIDOI',
        N'Di dời',
        N'Công tác di dời cây'
    ),
    (
        'CHATHA',
        N'Chặt hạ',
        N'Công tác chặt hạ cây nguy hiểm, chết'
    ),
    (
        'XLSC',
        N'Xử lý sự cố',
        N'Xử lý các sự cố cây gãy, đổ do mưa bão hoặc nguyên nhân khác'
    );

GO
-- ==========================================
-- 7. THÊM DỮ LIỆU KẾ HOẠCH CÔNG VIỆC
-- ==========================================
INSERT INTO
    KeHoachCongViec (
        MaKeHoach,
        MaLoaiCongViec,
        TieuDe,
        MoTa,
        FilePDFKeHoach,
        FilePDFDeNghiCapPhep,
        NguoiLap,
        TrangThai,
        FilePDFBoSungKeHoach,
        YKienPheDuyet,
        NguoiPheDuyet,
        NgayPheDuyet,
        NgayTao,
        NgayCapNhat,
        NguoiXuLy,
        NgayXuLy,
        MaTuyenDuong
    )
VALUES
    (
        'KH01',
        'CS',
        N'Kế hoạch chăm sóc cây tuyến Lê Duẩn',
        N'Thực hiện cắt tỉa cành vươn, bón phân định kỳ',
        'kh01_kehoach.pdf',
        'kh01_capphep.pdf',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đã phê duyệt',
        NULL,
        N'Đồng ý triển khai theo kế hoạch',
        'aB3kL9pQx2mV8nZ1cY5t',
        GETDATE(),
        GETDATE(),
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        GETDATE(),
        'LD'
    ),
    (
        'KH02',
        'TM',
        N'Kế hoạch trồng dặm cây tuyến Nguyễn Văn Linh',
        N'Trồng dặm bổ sung các vị trí cây xanh bị khuyết',
        'kh02_kehoach.pdf',
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đang thẩm định',
        NULL,
        NULL,
        NULL,
        NULL,
        GETDATE(),
        NULL,
        NULL,
        NULL,
        'NVL'
    ),
    (
        'KH03',
        'DIDOI',
        N'Di dời cây xanh mở rộng nút giao Hùng Vương',
        N'Di dời 5 cây Lim xẹt phục vụ thi công nút giao',
        'kh03_kehoach.pdf',
        'kh03_capphep.pdf',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đã phê duyệt',
        NULL,
        N'Đã phê duyệt phương án di dời',
        'aB3kL9pQx2mV8nZ1cY5t',
        DATEADD(DAY, -2, GETDATE()),
        DATEADD(DAY, -5, GETDATE()),
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        GETDATE(),
        'HV'
    ),
    (
        'KH04',
        'XLSC',
        N'Xử lý cây gãy đổ sau bão đường Bạch Đằng',
        N'Khắc phục sự cố 3 cây đổ tại vỉa hè phía sông',
        NULL,
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đã hủy',
        NULL,
        N'Hủy do trùng lắp kế hoạch khẩn cấp',
        'aB3kL9pQx2mV8nZ1cY5t',
        GETDATE(),
        DATEADD(HOUR, -5, GETDATE()),
        NULL,
        NULL,
        NULL,
        'BD'
    ),
    (
        'KH05',
        'CS',
        N'Cắt tỉa tạo tán cây xanh đường Trần Phú',
        N'Cắt tỉa hạ thấp độ cao, đảm bảo an toàn lưới điện',
        'kh05_kehoach.pdf',
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đã gửi',
        NULL,
        NULL,
        NULL,
        NULL,
        GETDATE(),
        NULL,
        NULL,
        NULL,
        'TP'
    ),
    (
        'KH06',
        'TM',
        N'Trồng cây xanh cách ly đường Nguyễn Văn Linh',
        N'Trồng bổ sung dải phân cách giữa đoạn gần sân bay',
        NULL,
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Bị từ chối',
        NULL,
        N'Thiếu hồ sơ thiết kế dải cây xanh',
        'aB3kL9pQx2mV8nZ1cY5t',
        GETDATE(),
        DATEADD(DAY, -1, GETDATE()),
        NULL,
        NULL,
        NULL,
        'NVL'
    ),
    (
        'KH07',
        'CS',
        N'Bón phân định kỳ tuyến Lê Duẩn đợt 2',
        N'Bón phân NPK cho 200 cây xanh trên toàn tuyến',
        'kh07_kehoach.pdf',
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đang thẩm định',
        NULL,
        NULL,
        NULL,
        NULL,
        GETDATE(),
        NULL,
        NULL,
        NULL,
        'LD'
    ),
    (
        'KH08',
        'CHATHA',
        N'Chặt hạ cây chết khô đường Hùng Vương',
        N'Xử lý 2 cây Bàng đã chết khô có nguy cơ ngã đổ',
        'kh08_kehoach.pdf',
        'kh08_capphep.pdf',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đã phê duyệt',
        NULL,
        N'Đã kiểm tra hiện trường, đồng ý chặt hạ',
        'aB3kL9pQx2mV8nZ1cY5t',
        DATEADD(DAY, -1, GETDATE()),
        DATEADD(DAY, -3, GETDATE()),
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        GETDATE(),
        'HV'
    ),
    (
        'KH09',
        'TM',
        N'Thay thế cây cằn cỗi đường Bạch Đằng',
        N'Thay 10 cây bằng lăng kém phát triển bằng cây giáng hương',
        'kh09_kehoach.pdf',
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đã gửi',
        NULL,
        NULL,
        NULL,
        NULL,
        GETDATE(),
        NULL,
        NULL,
        NULL,
        'BD'
    ),
    (
        'KH10',
        'XLSC',
        N'Chống dựng cây nghiêng sau mưa lớn đường Trần Phú',
        N'Dựng lại 4 cây mới trồng bị nghiêng do đất mềm',
        NULL,
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đã phê duyệt',
        NULL,
        N'Triển khai gấp trong ngày',
        'aB3kL9pQx2mV8nZ1cY5t',
        GETDATE(),
        GETDATE(),
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        GETDATE(),
        'TP'
    ),
    (
        'KH11',
        'CS',
        N'Quét vôi gốc cây phòng trừ sâu bệnh đợt cuối năm',
        N'Thực hiện quét vôi cho cây xanh các tuyến trung tâm',
        'kh11_kehoach.pdf',
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đang thẩm định',
        NULL,
        NULL,
        NULL,
        NULL,
        DATEADD(DAY, -1, GETDATE()),
        NULL,
        NULL,
        NULL,
        'LD'
    ),
    (
        'KH12',
        'TM',
        N'Trồng hoa trang trí dải phân cách đường Trần Phú',
        N'Trồng hoa chiều tím và dâm bụt dải phân cách',
        NULL,
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đã gửi',
        NULL,
        NULL,
        NULL,
        NULL,
        DATEADD(HOUR, -2, GETDATE()),
        NULL,
        NULL,
        NULL,
        'TP'
    ),
    (
        'KH13',
        'CS',
        N'Tưới nước cây xanh khu vực cầu Rồng',
        N'Tưới nước duy trì cây xanh đầu cầu Rồng phía Hải Châu',
        NULL,
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đang thẩm định',
        NULL,
        NULL,
        NULL,
        NULL,
        GETDATE(),
        NULL,
        NULL,
        NULL,
        'BD'
    ),
    (
        'KH14',
        'CHATHA',
        N'Cắt cành cây che khuất biển báo giao thông Lê Duẩn',
        N'Xử lý cành cây che khuất tầm nhìn biển báo ngã tư',
        'kh14_kehoach.pdf',
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đã phê duyệt',
        NULL,
        N'Đồng ý cắt tỉa ngay',
        'aB3kL9pQx2mV8nZ1cY5t',
        GETDATE(),
        GETDATE(),
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        GETDATE(),
        'LD'
    ),
    (
        'KH15',
        'TM',
        N'Trồng cây bóng mát đường Lê Duẩn',
        N'Hỗ trợ trồng 10 cây bằng lăng tại vỉa hè rộng',
        'kh15_kehoach.pdf',
        NULL,
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đã gửi',
        NULL,
        NULL,
        NULL,
        NULL,
        GETDATE(),
        NULL,
        NULL,
        NULL,
        'LD'
    );

GO