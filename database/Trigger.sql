USE QuanLyCayXanhDN;

GO

-- ==============================================================================
-- Triggers nghiệp vụ bổ sung cho bảng KeHoachCongViec
-- ==============================================================================

-- -------------------------------------------------------------------------------
-- TRIGGER 1: Tự động hủy kế hoạch nếu quá 15 ngày chưa được phê duyệt hoặc từ chối
-- Khi UPDATE xảy ra, nếu trạng thái vẫn chưa là 'Đã phê duyệt'/'Bị từ chối'/'Đã hủy'
-- VÀ đã quá 15 ngày kể từ NgayTao → tự động chuyển sang 'Đã hủy'
-- -------------------------------------------------------------------------------
CREATE OR ALTER TRIGGER TRG_KeHoachCongViec_AutoHuyQuaHan
ON KeHoachCongViec
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- TH1: Tự động hủy nếu trạng thái là 'Đã gửi' hoặc 'Đang thẩm định', chưa có người duyệt (NguoiPheDuyet IS NULL) và quá 15 ngày kể từ ngày tạo
    IF EXISTS (
        SELECT 1 
        FROM KeHoachCongViec t
        INNER JOIN inserted i ON t.MaKeHoach = i.MaKeHoach
        WHERE t.TrangThai IN (N'Đã gửi', N'Đang thẩm định')
          AND t.NguoiPheDuyet IS NULL
          AND DATEDIFF(DAY, t.NgayTao, GETDATE()) > 15
    )
    BEGIN
        UPDATE t
        SET t.TrangThai   = N'Đã hủy',
            t.NgayCapNhat = GETDATE()
        FROM KeHoachCongViec t
        INNER JOIN inserted i ON t.MaKeHoach = i.MaKeHoach
        WHERE t.TrangThai IN (N'Đã gửi', N'Đang thẩm định')
          AND t.NguoiPheDuyet IS NULL
          AND DATEDIFF(DAY, t.NgayTao, GETDATE()) > 15;
    END
END
GO

-- -------------------------------------------------------------------------------
-- TRIGGER 2: Không cho phép chỉnh sửa bất kỳ dữ liệu nào khi TrangThai = 'Đã hủy'
-- Dùng INSTEAD OF để chặn trước khi dữ liệu ghi xuống bảng
-- -------------------------------------------------------------------------------
CREATE OR ALTER TRIGGER TRG_KeHoachCongViec_BlockEditDaHuy
ON KeHoachCongViec
INSTEAD OF UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Chặn nếu record đang ở trạng thái 'Đã hủy' trước khi update
    IF EXISTS (
        SELECT 1 FROM deleted d
        WHERE d.TrangThai = N'Đã hủy'
    )
    BEGIN
        RAISERROR(N'Không thể chỉnh sửa kế hoạch đã ở trạng thái "Đã hủy".', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Nếu không vi phạm → thực hiện UPDATE thật sự
    UPDATE t
    SET
        t.MaLoaiCongViec        = i.MaLoaiCongViec,
        t.TieuDe                = i.TieuDe,
        t.MoTa                  = i.MoTa,
        t.FilePDFKeHoach        = i.FilePDFKeHoach,
        t.FilePDFDeNghiCapPhep  = i.FilePDFDeNghiCapPhep,
        t.NguoiLap              = i.NguoiLap,
        t.TrangThai             = i.TrangThai,
        t.FilePDFBoSungKeHoach  = i.FilePDFBoSungKeHoach,
        t.YKienPheDuyet         = i.YKienPheDuyet,
        t.NguoiPheDuyet         = i.NguoiPheDuyet,
        t.NgayPheDuyet          = i.NgayPheDuyet,
        t.NgayTao               = i.NgayTao,
        t.NgayCapNhat           = i.NgayCapNhat,
        t.NguoiXuLy             = i.NguoiXuLy,
        t.NgayXuLy              = i.NgayXuLy,
        t.MaTuyenDuong          = i.MaTuyenDuong
    FROM KeHoachCongViec t
    INNER JOIN inserted i ON t.MaKeHoach = i.MaKeHoach;
END
GO

-- -------------------------------------------------------------------------------
-- TRIGGER 3: Chỉ cho phép người lập (NguoiLap) có MaVaiTro = 'NVKT' hủy kế hoạch (→ 'Đã hủy')
--            Chỉ được hủy khi TrangThai hiện tại là 'Đã gửi' hoặc 'Bị từ chối'
-- -------------------------------------------------------------------------------
CREATE OR ALTER TRIGGER TRG_KeHoachCongViec_KiemTraHuyKeHoach
ON KeHoachCongViec
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF UPDATE(TrangThai)
    BEGIN
        -- TH2: Kế hoạch bị từ chối (TrangThai = N'Bị từ chối') quá 15 ngày thì không cho phép hủy nữa
        IF EXISTS (
            SELECT 1
            FROM inserted i
            INNER JOIN deleted d ON i.MaKeHoach = d.MaKeHoach
            WHERE i.TrangThai = N'Đã hủy'
              AND d.TrangThai = N'Bị từ chối'
              AND DATEDIFF(DAY, i.NgayTao, GETDATE()) > 15
        )
        BEGIN
            RAISERROR(N'Kế hoạch bị từ chối đã quá 15 ngày không được phép hủy nữa.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Kiểm tra hủy thủ công thông thường khi chưa quá hạn 15 ngày:
        -- - Chỉ cho phép NVKT hủy
        IF EXISTS (
            SELECT 1
            FROM inserted i
            INNER JOIN deleted d    ON i.MaKeHoach = d.MaKeHoach
            INNER JOIN NguoiDung nd ON nd.MaNguoiDung = i.NguoiLap
            WHERE i.TrangThai = N'Đã hủy'
              AND nd.MaVaiTro <> 'NVKT'
              AND DATEDIFF(DAY, i.NgayTao, GETDATE()) <= 15
        )
        BEGIN
            RAISERROR(N'Chỉ nhân viên kỹ thuật (NVKT) mới được phép hủy kế hoạch.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- - Chỉ được hủy khi trạng thái là 'Đã gửi' hoặc 'Bị từ chối'
        IF EXISTS (
            SELECT 1
            FROM inserted i
            INNER JOIN deleted d ON i.MaKeHoach = d.MaKeHoach
            WHERE i.TrangThai = N'Đã hủy'
              AND d.TrangThai NOT IN (N'Đã gửi', N'Bị từ chối')
              AND DATEDIFF(DAY, i.NgayTao, GETDATE()) <= 15
        )
        BEGIN
            RAISERROR(N'Chỉ được hủy kế hoạch khi trạng thái là "Đã gửi" hoặc "Bị từ chối".', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
    END
END
GO

-- -------------------------------------------------------------------------------
-- TRIGGER 4: Chỉ cho phép người lập (NguoiLap) có MaVaiTro = 'NVKT' gửi lại kế hoạch (→ 'Đã gửi')
--            khi trạng thái cũ = 'Bị từ chối'
-- -------------------------------------------------------------------------------
CREATE OR ALTER TRIGGER TRG_KeHoachCongViec_KiemTraGuiLaiKeHoach
ON KeHoachCongViec
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF UPDATE(TrangThai)
    BEGIN
        -- Kiểm tra: nếu gửi lại mà người lập (NguoiLap) không phải NVKT thì chặn (chỉ kiểm tra khi kế hoạch chưa quá hạn 15 ngày)
        IF EXISTS (
            SELECT 1
            FROM inserted i
            INNER JOIN deleted d    ON i.MaKeHoach = d.MaKeHoach
            INNER JOIN NguoiDung nd ON nd.MaNguoiDung = i.NguoiLap
            WHERE i.TrangThai = N'Đã gửi'        -- đang gửi lại
              AND d.TrangThai = N'Bị từ chối'     -- trước đó bị từ chối
              AND nd.MaVaiTro <> 'NVKT'           -- người lập không phải NVKT
              AND DATEDIFF(DAY, i.NgayTao, GETDATE()) <= 15
        )
        BEGIN
            RAISERROR(N'Chỉ nhân viên kỹ thuật (NVKT) mới được phép gửi lại kế hoạch sau khi bị từ chối.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
    END
END
GO

-- -------------------------------------------------------------------------------
-- TRIGGER 5: Chỉ cho phép CBQL hủy phê duyệt
--            (chuyển TrangThai từ 'Đã phê duyệt' hoặc 'Bị tư chối' → 'Đang thẩm định')
-- -------------------------------------------------------------------------------
CREATE OR ALTER TRIGGER TRG_KeHoachCongViec_KiemTraHuyPheDuyet
ON KeHoachCongViec
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF UPDATE(TrangThai)
    BEGIN
        -- Kiểm tra: nếu hủy phê duyệt mà NguoiPheDuyet không phải CBQL thì chặn (chỉ kiểm tra khi kế hoạch chưa quá hạn 15 ngày)
        IF EXISTS (
            SELECT 1
            FROM inserted i
            INNER JOIN deleted d    ON i.MaKeHoach = d.MaKeHoach
            INNER JOIN NguoiDung nd ON nd.MaNguoiDung = i.NguoiPheDuyet
            WHERE i.TrangThai = N'Đang thẩm định'  -- đang chuyển về thẩm định (hủy phê duyệt)
              AND d.TrangThai IN (N'Đã phê duyệt', N'Bị từ chối')     -- trước đó đã phê duyệt
              AND nd.MaVaiTro <> 'CBQL'             -- người phê duyệt không phải CBQL
              AND DATEDIFF(DAY, i.NgayTao, GETDATE()) <= 15
        )
        BEGIN
            RAISERROR(N'Chỉ cán bộ quản lý (CBQL) mới được phép hủy phê duyệt kế hoạch.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
    END
END
GO