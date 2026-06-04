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
VALUES (
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
    VaiTro (
        MaVaiTro,
        TenVaiTro,
        MoTa,
        Slug,
        Icon
    )
VALUES (
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
VALUES ('NVKT', 'TDTTKH'), -- Nhân viên kỹ thuật: Theo dõi trạng thái kế hoạch
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
    XaPhuong (
        MaXaPhuong,
        MaHanhChinh,
        TenXaPhuong,
        LoaiDanhMuc
    )
VALUES (
        'PTT',
        20101,
        N'Phường Thạch Thang',
        N'Phường'
    ),
    (
        'PHCI',
        20102,
        N'Phường Hải Châu I',
        N'Phường'
    ),
    (
        'PHCII',
        20103,
        N'Phường Hải Châu II',
        N'Phường'
    ),
    (
        'PPN',
        20104,
        N'Phường Phước Ninh',
        N'Phường'
    ),
    (
        'PHTT',
        20105,
        N'Phường Hòa Thuận Tây',
        N'Phường'
    ),
    (
        'HKE',
        20301,
        N'Phường Hòa Khê',
        N'Phường'
    ),
    (
        'XHA',
        20302,
        N'Phường Xuân Hà',
        N'Phường'
    ),
    (
        'AHB',
        20401,
        N'Phường An Hải Bắc',
        N'Phường'
    ),
    (
        'PMY',
        20402,
        N'Phường Phước Mỹ',
        N'Phường'
    );

GO
INSERT INTO
    TuyenDuong (
        MaTuyenDuong,
        TenTuyenDuong,
        TenVietTat,
        LoaiDuong,
        MaXaPhuong
    )
VALUES (
        'LD',
        N'Lê Duẩn',
        'LD',
        N'Đường lớn',
        'PTT'
    ),
    (
        'NVL',
        N'Nguyễn Văn Linh',
        'NVL',
        N'Đường lớn',
        'PPN'
    ),
    (
        'BD',
        N'Bạch Đằng',
        'BD',
        N'Đường lớn',
        'PHCI'
    ),
    (
        'TP',
        N'Trần Phú',
        'TP',
        N'Đường lớn',
        'PHCI'
    ),
    (
        'HV',
        N'Hùng Vương',
        'HV',
        N'Đường lớn',
        'PHCII'
    ),
    (
        'DBP',
        N'Điện Biên Phủ',
        'DBP',
        N'Đường lớn',
        'HKE'
    ),
    (
        'TCV',
        N'Trần Cao Vân',
        'TCV',
        N'Đường lớn',
        'XHA'
    ),
    (
        'NQ',
        N'Ngô Quyền',
        'NQ',
        N'Đường lớn',
        'AHB'
    ),
    (
        'VNG',
        N'Võ Nguyên Giáp',
        'VNG',
        N'Đường lớn',
        'PMY'
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
VALUES (
        'm3Lp8Qz1xK5vB9cJ2hF4',
        'cbquanly',
        'e10adc3949ba59abbe56e057f20f883e',
        N'Nguyễn Văn Quản Lý',
        'quanly@danang.gov.vn',
        '0901234567',
        'LD',
        N'123 Lê Duẩn, Đà Nẵng',
        GETDATE (),
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
        GETDATE (),
        NULL,
        'NVKT'
    ),
    (
        'leducthien',
        'leducthien',
        '$2b$10$din8NKQ7LnG/tA3rvP1yvu7HcZdbmFE.P/puWrB3YMiG6IVx8vorq',
        N'Lê Đức Thiện',
        'leducthien@gmail.com',
        '0904444444',
        'LD',
        N'Đà Nẵng',
        GETDATE (),
        NULL,
        'NVKT'
    ),
    (
        'duongcongtien',
        'duongcongtien',
        '$2b$10$din8NKQ7LnG/tA3rvP1yvu7HcZdbmFE.P/puWrB3YMiG6IVx8vorq',
        N'Dương Công Tiến',
        'duongcongtien@gmail.com',
        '0905555555',
        'NVL',
        N'Đà Nẵng',
        GETDATE (),
        NULL,
        'NVKT'
    ),
    (
        'nguyenhuuphuoc',
        'nguyenhuuphuoc',
        '$2b$10$din8NKQ7LnG/tA3rvP1yvu7HcZdbmFE.P/puWrB3YMiG6IVx8vorq',
        N'Nguyễn Hữu Phước',
        'nguyenhuuphuoc@gmail.com',
        '0906666666',
        'BD',
        N'Đà Nẵng',
        GETDATE (),
        NULL,
        'CBQL'
    ),
    (
        'nguyenhoainam',
        'nguyenhoainam',
        '$2b$10$din8NKQ7LnG/tA3rvP1yvu7HcZdbmFE.P/puWrB3YMiG6IVx8vorq',
        N'Nguyễn Hoài Nam',
        'nguyenhoainam@gmail.com',
        '0907777777',
        'TP',
        N'Đà Nẵng',
        GETDATE (),
        NULL,
        'CBQL'
    );

-- Bổ sung người dùng (nếu chưa có)
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
        MaVaiTro
    )
VALUES (
        'cn1',
        'congnhan1',
        'e10adc3949ba59abbe56e057f20f883e',
        N'Lê Văn Công',
        'cn1@danang.gov.vn',
        '0901111111',
        'LD',
        N'12 Lê Duẩn, Đà Nẵng',
        'CNCX'
    ),
    (
        'cn2',
        'congnhan2',
        'e10adc3949ba59abbe56e057f20f883e',
        N'Phạm Thị Thợ',
        'cn2@danang.gov.vn',
        '0902222222',
        'BD',
        N'34 Bạch Đằng, Đà Nẵng',
        'CNCX'
    ),
    (
        'nd1',
        'nguoidan1',
        'e10adc3949ba59abbe56e057f20f883e',
        N'Nguyễn Văn Dân',
        'dandan@gmail.com',
        '0903333333',
        'TP',
        N'56 Trần Phú, Đà Nẵng',
        'ND'
    );
GO
GO
-- ==========================================
-- 6. THÊM DỮ LIỆU DANH MỤC CÔNG VIỆC
-- ==========================================
INSERT INTO
    DanhMucCongViec (
        MaLoaiCongViec,
        TenCongViec,
        MoTaCV
    )
VALUES (
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
INSERT INTO
    DanhMucCayTrong (
        MaDMCay,
        TenCayTrong,
        ChieuCaoTruongThanh,
        DuongKinhTruongThanh,
        HinhThucTanCay,
        DangLa,
        MauLa,
        KyRungLa,
        KyNoHoa,
        MauHoa,
        LoaiCay,
        MoTa,
        TrangThai
    )
VALUES (
        'SAO',
        N'Sao đen',
        25.0,
        0.8,
        N'tháp',
        N'bản',
        N'Xanh đậm',
        N'Thường xanh',
        N'Mùa xuân',
        N'Trắng',
        N'đại mộc',
        N'Cây bóng mát',
        N'Được phép trồng'
    ),
    (
        'BANG',
        N'Bằng lăng',
        15.0,
        0.5,
        N'tròn',
        N'bản',
        N'Xanh',
        N'Rụng mùa đông',
        N'Mùa hè',
        N'Tím',
        N'trung mộc',
        N'Hoa đẹp',
        N'Được phép trồng'
    ),
    (
        'PHUONG',
        N'Phượng vĩ',
        12.0,
        0.6,
        N'phân tầng',
        N'bản',
        N'Xanh',
        N'Rụng lá',
        N'Mùa hè',
        N'Đỏ',
        N'trung mộc',
        N'Hoa đỏ rực',
        N'Được phép trồng'
    ),
    (
        'DUA',
        N'Dừa',
        20.0,
        0.4,
        N'tự do',
        N'kim',
        N'Xanh',
        N'Thường xanh',
        N'Quanh năm',
        N'Vàng nhạt',
        N'đại mộc',
        N'Cây cảnh quan',
        N'Được phép trồng'
    ),
    (
        'ME',
        N'Me tây',
        10.0,
        0.3,
        N'trứng',
        N'bản',
        N'Xanh',
        N'Rụng mùa khô',
        N'Mùa xuân',
        N'Vàng',
        N'tiểu mộc',
        N'Cây ăn quả',
        N'không được phép trồng'
    );
GO

INSERT INTO
    CayXanh (
        MaCay,
        MaDMCay,
        NgayTrong,
        NguonGoc,
        ChieuCaoHienTai,
        DuongKinhThanHienTai,
        DuongKinhTanHienTai,
        TrangThaiSucKhoe,
        KinhDo,
        ViDo,
        MaTuyenDuong,
        MaNguoiCapNhat
    )
VALUES (
        'CX001',
        'SAO',
        '2015-03-10',
        N'Vườn ươm Hòa Cường',
        12.5,
        0.45,
        4.2,
        N'Bình thường',
        '108.220833',
        '16.068056',
        'LD',
        'aB3kL9pQx2mV8nZ1cY5t'
    ),
    (
        'CX002',
        'BANG',
        '2018-05-20',
        N'Vườn ươm Hòa Xuân',
        5.2,
        0.25,
        2.8,
        N'Bình thường',
        '108.221944',
        '16.069167',
        'NVL',
        'aB3kL9pQx2mV8nZ1cY5t'
    ),
    (
        'CX003',
        'PHUONG',
        '2016-02-14',
        N'Vườn ươm Hòa Phước',
        8.0,
        0.35,
        5.0,
        N'nguy hiểm thấp',
        '108.223056',
        '16.070278',
        'BD',
        'aB3kL9pQx2mV8nZ1cY5t'
    ),
    (
        'CX004',
        'DUA',
        '2019-07-30',
        N'Vườn ươm Hòa Khánh',
        3.5,
        0.18,
        1.5,
        N'Bình thường',
        '108.224167',
        '16.071389',
        'TP',
        'aB3kL9pQx2mV8nZ1cY5t'
    ),
    (
        'CX005',
        'ME',
        '2017-11-11',
        N'Vườn ươm Hòa Liên',
        4.0,
        0.20,
        2.0,
        N'nguy hiểm trung bình',
        '108.225278',
        '16.072500',
        'HV',
        'aB3kL9pQx2mV8nZ1cY5t'
    );
GO

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
        MaTuyenDuong,
        NgayTao,
        NguoiXuLy,
        NgayXuLy,
        NguoiPheDuyet,
        NgayPheDuyet,
        YKienPheDuyet
    )
VALUES
    -- KH001: Đã gửi
    (
        'KH001',
        'TM',
        N'Trồng mới cây xanh đường Lê Duẩn',
        N'Trồng thêm sao đen',
        'kh_tm_ld.pdf',
        'denghi_tm_ld.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã phê duyệt',
        'LD',
        '2026-05-20 08:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-20 09:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-20 09:00:00',
        NULL
    ),
    (
        'KH002',
        'CS',
        N'Chăm sóc cây xanh đường Nguyễn Văn Linh',
        N'Tưới nước bón phân',
        'kh_cs_nvl.pdf',
        'denghi_cs_nvl.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã phê duyệt',
        'NVL',
        '2026-05-21 08:30:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-21 09:30:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-21 09:30:00',
        NULL
    ),
    (
        'KH003',
        'DIDOI',
        N'Di dời cây phượng đường Bạch Đằng',
        N'Di dời phục vụ thi công',
        'kh_dd_bd.pdf',
        'denghi_dd_bd.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đang thẩm định',
        'BD',
        '2026-05-21 10:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-21 11:00:00',
        NULL,
        NULL,
        NULL
    ),
    (
        'KH004',
        'CHATHA',
        N'Chặt hạ cây nguy hiểm đường Trần Phú',
        N'Xử lý cây bục gốc',
        'kh_ch_tp.pdf',
        'denghi_ch_tp.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Bị từ chối',
        'TP',
        '2026-05-22 08:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-22 09:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-22 09:00:00',
        N'Cần bổ sung ảnh hiện trạng'
    ),
    (
        'KH005',
        'XLSC',
        N'Xử lý sự cố cây đổ đường Hùng Vương',
        N'Cắt tỉa cành gãy',
        'kh_sc_hv.pdf',
        'denghi_sc_hv.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã hủy',
        'HV',
        '2026-05-22 09:30:00',
        'aB3kL9pQx2mV8nZ1cY5t',
        '2026-05-22 10:30:00',
        NULL,
        NULL,
        NULL
    ),
    (
        'KH006',
        'TM',
        N'Trồng mới cây xanh đường Điện Biên Phủ',
        N'Trồng sao đen',
        'kh_tm_dbp.pdf',
        'denghi_tm_dbp.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã phê duyệt',
        'DBP',
        '2026-05-22 14:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-22 15:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-22 15:00:00',
        NULL
    ),
    (
        'KH007',
        'CS',
        N'Chăm sóc thảm cỏ đường Ngô Quyền',
        N'Cắt cỏ định kỳ',
        'kh_cs_nq.pdf',
        'denghi_cs_nq.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã gửi',
        'NQ',
        '2026-05-22 16:00:00',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'KH008',
        'DIDOI',
        N'Di dời cây xanh đường Võ Nguyên Giáp',
        N'Di dời cây mở rộng nút giao',
        'kh_dd_vng.pdf',
        'denghi_dd_vng.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã phê duyệt',
        'VNG',
        '2026-05-23 10:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-23 11:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-23 11:00:00',
        NULL
    ),
    (
        'KH009',
        'CHATHA',
        N'Chặt hạ cây sâu bệnh đường Trần Cao Vân',
        N'Chặt hạ cây có nguy cơ ngã đổ',
        'kh_ch_tcv.pdf',
        'denghi_ch_tcv.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đang thẩm định',
        'TCV',
        '2026-05-24 08:30:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-24 09:30:00',
        NULL,
        NULL,
        NULL
    ),
    (
        'KH010',
        'XLSC',
        N'Xử lý cành gãy đường Lê Duẩn',
        N'Giải phóng lối đi',
        'kh_sc_ld.pdf',
        'denghi_sc_ld.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Bị từ chối',
        'LD',
        '2026-05-24 13:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-24 14:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-24 14:00:00',
        N'Phương án không khả thi'
    ),
    (
        'KH011',
        'TM',
        N'Trồng hoa trang trí đường Nguyễn Văn Linh',
        N'Trồng hoa cảnh quan',
        'kh_tm_nvl.pdf',
        'denghi_tm_nvl.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã gửi',
        'NVL',
        '2026-05-24 15:00:00',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'KH012',
        'CS',
        N'Chăm sóc bồn hoa đường Bạch Đằng',
        N'Nhổ cỏ dại bón phân',
        'kh_cs_bd.pdf',
        'denghi_cs_bd.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã phê duyệt',
        'BD',
        '2026-05-25 08:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-25 09:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-25 09:00:00',
        NULL
    ),
    (
        'KH013',
        'DIDOI',
        N'Di dời cây cảnh đường Trần Phú',
        N'Di dời cây sứ lớn',
        'kh_dd_tp.pdf',
        'denghi_dd_tp.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã phê duyệt',
        'TP',
        '2026-05-25 09:30:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-25 10:30:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-25 10:30:00',
        NULL
    ),
    (
        'KH014',
        'CHATHA',
        N'Chặt hạ cây khô đường Hùng Vương',
        N'Đảm bảo an toàn giao thông',
        'kh_ch_hv.pdf',
        'denghi_ch_hv.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã hủy',
        'HV',
        '2026-05-25 11:00:00',
        'aB3kL9pQx2mV8nZ1cY5t',
        '2026-05-25 12:00:00',
        NULL,
        NULL,
        NULL
    ),
    (
        'KH015',
        'XLSC',
        N'Xử lý sự cố gãy cành đường Điện Biên Phủ',
        N'Cắt cành cây đổ đè dây điện',
        'kh_sc_dbp.pdf',
        'denghi_sc_dbp.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã phê duyệt',
        'DBP',
        '2026-05-25 14:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-25 15:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-25 15:00:00',
        NULL
    ),
    (
        'KH016',
        'TM',
        N'Trồng bổ sung cây xanh đường Ngô Quyền',
        N'Trồng bằng lăng tím',
        'kh_tm_nq.pdf',
        'denghi_tm_nq.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đang thẩm định',
        'NQ',
        '2026-05-25 16:00:00',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        '2026-05-25 17:00:00',
        NULL,
        NULL,
        NULL
    ),
    (
        'KH017',
        'CS',
        N'Cắt tỉa gọn cây đường Võ Nguyên Giáp',
        N'Tránh che khuất tầm nhìn',
        'kh_cs_vng.pdf',
        'denghi_cs_vng.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã gửi',
        'VNG',
        GETDATE (),
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'KH018',
        'DIDOI',
        N'Di dời cây xanh đường Trần Cao Vân',
        N'Phục vụ dự án ngầm hóa',
        'kh_dd_tcv.pdf',
        'denghi_dd_tcv.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã phê duyệt',
        'TCV',
        GETDATE (),
        'm3Lp8Qz1xK5vB9cJ2hF4',
        GETDATE (),
        'm3Lp8Qz1xK5vB9cJ2hF4',
        GETDATE (),
        NULL
    ),
    (
        'KH019',
        'CHATHA',
        N'Chặt hạ cây xà cừ đường Lê Duẩn',
        N'Rễ làm hỏng vỉa hè',
        'kh_ch_ld.pdf',
        'denghi_ch_ld.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Bị từ chối',
        'LD',
        GETDATE (),
        'm3Lp8Qz1xK5vB9cJ2hF4',
        GETDATE (),
        'm3Lp8Qz1xK5vB9cJ2hF4',
        GETDATE (),
        N'Cần bản vẽ chi tiết'
    ),
    (
        'KH020',
        'XLSC',
        N'Giải phóng cây đổ đường Nguyễn Văn Linh',
        N'Cây đổ đè lên vỉa hè',
        'kh_sc_nvl.pdf',
        'denghi_sc_nvl.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        N'Đã hủy',
        'NVL',
        GETDATE (),
        'aB3kL9pQx2mV8nZ1cY5t',
        GETDATE (),
        NULL,
        NULL,
        NULL
    );
GO

INSERT INTO
    KeHoachPhanCong (
        MaKHPC,
        MaKHCV,
        TieuDe,
        FilePDF,
        NguoiTao,
        TrangThaiNghiemThu
    )
VALUES (
        'PC001',
        'KH001',
        N'Phân công trồng cây Lê Duẩn',
        'pc_kh001.pdf',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Chưa nghiệm thu'
    ),
    (
        'PC002',
        'KH002',
        N'Phân công chăm sóc Nguyễn Văn Linh',
        'pc_kh002.pdf',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Đang nghiệm thu'
    ),
    (
        'PC003',
        'KH003',
        N'Phân công di dời cây Bạch Đằng',
        'pc_kh003.pdf',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Chưa nghiệm thu'
    ),
    (
        'PC004',
        'KH004',
        N'Phân công chặt hạ Trần Phú',
        'pc_kh004.pdf',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Không đạt yêu cầu'
    ),
    (
        'PC005',
        'KH005',
        N'Phân công xử lý sự cố Hùng Vương',
        'pc_kh005.pdf',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        N'Chưa nghiệm thu'
    );
GO

INSERT INTO
    ChiTietPhanCong (
        MaChiTiet,
        MaKHPC,
        MaCongNhan,
        CongViecCuThe,
        ThoiGianBatDau,
        ThoiGianKetThuc,
        XacNhanLam,
        KhoiLuongHoanThanh,
        XacNhanHoanTat,
        DanhGia
    )
VALUES (
        'CT01',
        'PC001',
        'cn1',
        N'Đào hố, trồng 10 cây sao đen',
        '2025-04-01 07:00:00',
        '2025-04-05 17:00:00',
        1,
        N'10/10 cây',
        1,
        N'Đạt yêu cầu'
    ),
    (
        'CT02',
        'PC001',
        'cn2',
        N'Đào hố, trồng 10 cây còn lại',
        '2025-04-01 07:00:00',
        '2025-04-05 17:00:00',
        1,
        N'10/10 cây',
        1,
        N'Đạt'
    ),
    (
        'CT03',
        'PC002',
        'cn1',
        N'Tưới nước, bón phân cho 15 cây bằng lăng',
        '2025-04-10 08:00:00',
        '2025-04-12 16:00:00',
        1,
        N'15/15 cây',
        0,
        N'Chưa hoàn thành'
    ),
    (
        'CT04',
        'PC003',
        'cn2',
        N'Di dời 3 cây phượng',
        '2025-04-15 06:30:00',
        '2025-04-18 18:00:00',
        0,
        NULL,
        0,
        NULL
    ),
    (
        'CT05',
        'PC004',
        'cn1',
        N'Chặt hạ 2 cây me tây',
        '2025-04-20 07:00:00',
        '2025-04-21 15:00:00',
        1,
        N'2/2 cây',
        1,
        N'Không đạt do không giấy phép'
    );
GO

INSERT INTO
    AnhTruocPhanCong (
        MaAnhTruoc,
        MaChiTietPhanCong,
        DuongDanAnh,
        MoTa
    )
VALUES (
        'AT01',
        'CT01',
        '/uploads/truoc/ct01_1.jpg',
        N'Hố trồng trước khi trồng'
    ),
    (
        'AT02',
        'CT01',
        '/uploads/truoc/ct01_2.jpg',
        N'Cây giống trước khi trồng'
    ),
    (
        'AT03',
        'CT03',
        '/uploads/truoc/ct03_1.jpg',
        N'Cây bằng lăng trước chăm sóc'
    ),
    (
        'AT04',
        'CT04',
        '/uploads/truoc/ct04_1.jpg',
        N'Cây phượng cần di dời'
    ),
    (
        'AT05',
        'CT05',
        '/uploads/truoc/ct05_1.jpg',
        N'Cây me trước khi chặt'
    );
GO

INSERT INTO
    AnhSauPhanCong (
        MaAnhSau,
        MaChiTietPhanCong,
        DuongDanAnh,
        MoTa
    )
VALUES (
        'AS01',
        'CT01',
        '/uploads/sau/ct01_1.jpg',
        N'Sau khi trồng cây sao đen'
    ),
    (
        'AS02',
        'CT02',
        '/uploads/sau/ct02_1.jpg',
        N'Cây đã được lấp đất'
    ),
    (
        'AS03',
        'CT03',
        '/uploads/sau/ct03_1.jpg',
        N'Cây sau tưới bón phân'
    ),
    (
        'AS04',
        'CT05',
        '/uploads/sau/ct05_1.jpg',
        N'Gốc cây sau khi chặt'
    );
GO

INSERT INTO
    BaoCaoSuCo (
        MaBaoCao,
        MaNguoiBaoCao,
        MaXaPhuong,
        DiaChiCuThe,
        LoiPhanAnh,
        TrangThaiXuLy,
        MaNguoiXuLy
    )
VALUES (
        'BC01',
        'nd1',
        'PTT',
        N'125 Lê Duẩn',
        N'Cây sao đen có cành lớn nghiêng nguy hiểm',
        N'Chờ xử lý',
        NULL
    ),
    (
        'BC02',
        'nd1',
        'PHCI',
        N'23 Bạch Đằng',
        N'Cây phượng bị nghiêng sau mưa',
        N'đang xử lý',
        'aB3kL9pQx2mV8nZ1cY5t'
    ),
    (
        'BC03',
        'cn1',
        'PPN',
        N'78 Nguyễn Văn Linh',
        N'Cây bằng lăng bị sâu bệnh nặng',
        N'đã xử lý',
        'aB3kL9pQx2mV8nZ1cY5t'
    ),
    (
        'BC04',
        'cn2',
        'PHCII',
        N'45 Hùng Vương',
        N'Cây dừa có dấu hiệu mục gốc',
        N'bị từ chối',
        'm3Lp8Qz1xK5vB9cJ2hF4'
    ),
    (
        'BC05',
        'nd1',
        'PHTT',
        N'90 Hòa Thuận Tây',
        N'Cây me bị gãy nhánh lớn',
        N'đã hủy',
        NULL
    );
GO

INSERT INTO
    ChiTietBaoCao (
        MaChiTietBaoCao,
        MaBaoCao,
        MaCay,
        MaTuyenDuong,
        MoTaTìnhTrang,
        MucDoNguyHiem,
        DaXuLy
    )
VALUES (
        'CTBC01',
        'BC01',
        'CX001',
        'LD',
        N'Cành cấp 2 nghiêng quá 45°, có nguy cơ gãy',
        N'Trung bình',
        0
    ),
    (
        'CTBC02',
        'BC02',
        'CX003',
        'BD',
        N'Thân cây nghiêng 15° do đất yếu',
        N'Thấp',
        1
    ),
    (
        'CTBC03',
        'BC03',
        'CX002',
        'NVL',
        N'Lá bị rệp, thân có vết nứt',
        N'Cao',
        1
    ),
    (
        'CTBC04',
        'BC04',
        'CX004',
        'TP',
        N'Gốc dừa bị mục nát 30%',
        N'Khẩn cấp',
        0
    ),
    (
        'CTBC05',
        'BC05',
        'CX005',
        'HV',
        N'Nhánh lớn gãy, đè lên mái nhà dân',
        N'Cao',
        1
    );
GO

INSERT INTO
    HinhAnhBaoCao (
        MaHinhAnh,
        MaChiTietBaoCao,
        DuongDanHinh,
        MoTaHinh
    )
VALUES (
        'HA01',
        'CTBC01',
        '/bc/ctbc01_1.jpg',
        N'Cành nghiêng nguy hiểm'
    ),
    (
        'HA02',
        'CTBC01',
        '/bc/ctbc01_2.jpg',
        N'Góc nhìn từ dưới lên'
    ),
    (
        'HA03',
        'CTBC02',
        '/bc/ctbc02_1.jpg',
        N'Cây nghiêng toàn thân'
    ),
    (
        'HA04',
        'CTBC03',
        '/bc/ctbc03_1.jpg',
        N'Sâu bệnh trên lá'
    ),
    (
        'HA05',
        'CTBC05',
        '/bc/ctbc05_1.jpg',
        N'Nhánh gãy đổ xuống đường'
    );
GO

INSERT INTO
    HoSoLuuTruNghiemThu (
        MaHoSo,
        MaLoaiCongViec,
        TieuDe,
        MoTa,
        FilePDF,
        NguoiTao,
        MaTuyenDuong
    )
VALUES (
        'HS01',
        'TM',
        N'Nghiệm thu trồng mới tuyến Lê Duẩn',
        N'Đã trồng 20 cây sao đen đạt chuẩn',
        'hs_tm_ld.pdf',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        'LD'
    ),
    (
        'HS02',
        'CS',
        N'Nghiệm thu chăm sóc tuyến Nguyễn Văn Linh',
        N'Chăm sóc định kỳ tháng 4/2025',
        'hs_cs_nvl.pdf',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        'NVL'
    ),
    (
        'HS03',
        'XLSC',
        N'Nghiệm thu xử lý sự cố sau bão số 1',
        N'Xử lý 5 cây đổ tại Hùng Vương',
        'hs_sc_hv.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        'HV'
    ),
    (
        'HS04',
        'CHATHA',
        N'Nghiệm thu chặt hạ cây me tại Trần Phú',
        N'Đã chặt hạ an toàn, vệ sinh khu vực',
        'hs_ch_tp.pdf',
        'm3Lp8Qz1xK5vB9cJ2hF4',
        'TP'
    ),
    (
        'HS05',
        'DIDOI',
        N'Nghiệm thu di dời cây phượng Bạch Đằng',
        N'Di dời 3 cây phượng đến vườn ươm',
        'hs_dd_bd.pdf',
        'aB3kL9pQx2mV8nZ1cY5t',
        'BD'
    );
GO