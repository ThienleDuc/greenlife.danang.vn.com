import type { KeHoachCongViec } from '../types';

export const PLAN_TYPES = {
  pruning: { label: 'Cắt tỉa', color: 'bg-slate-100 text-slate-700' },
  planting: { label: 'Trồng mới', color: 'bg-slate-100 text-slate-700' },
  emergency: { label: 'Xử lý sự cố', color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  maintenance: { label: 'Bảo dưỡng', color: 'bg-slate-100 text-slate-700' },
};

export const PLAN_STATUS = {
  approved: { label: 'Đã duyệt', color: 'bg-emerald-50 text-emerald-700', dotColor: 'bg-emerald-500' },
  rejected: { label: 'Bị từ chối', color: 'bg-error-container text-on-error-container', dotColor: 'bg-error' },
  pending: { label: 'Đang thẩm định', color: 'bg-orange-100 text-orange-700', dotColor: 'bg-orange-400' },
  submitted: { label: 'Đã gửi', color: 'bg-blue-50 text-blue-700', dotColor: 'bg-blue-500' },
};

export const MOCK_XA_PHUONG = [
  { MaXaPhuong: 'XP001', TenXaPhuong: 'Phường Thạch Thang' },
  { MaXaPhuong: 'XP002', TenXaPhuong: 'Phường Hải Châu I' },
  { MaXaPhuong: 'XP003', TenXaPhuong: 'Phường Thanh Bình' },
  { MaXaPhuong: 'XP004', TenXaPhuong: 'Phường Thuận Phước' },
  { MaXaPhuong: 'XP005', TenXaPhuong: 'Phường Hòa Thuận Đông' },
];

export const MOCK_TUYEN_DUONG = [
  { MaTuyenDuong: 'TD001', TenTuyenDuong: 'Đường Bạch Đằng', MaXaPhuong: 'XP001' },
  { MaTuyenDuong: 'TD002', TenTuyenDuong: 'Đường Nguyễn Văn Linh', MaXaPhuong: 'XP005' },
  { MaTuyenDuong: 'TD003', TenTuyenDuong: 'Đường Điện Biên Phủ', MaXaPhuong: 'XP003' },
  { MaTuyenDuong: 'TD004', TenTuyenDuong: 'Đường Lê Duẩn', MaXaPhuong: 'XP001' },
  { MaTuyenDuong: 'TD005', TenTuyenDuong: 'Đường Trần Phú', MaXaPhuong: 'XP002' },
];

export const MOCK_KE_HOACH: KeHoachCongViec[] = [
  {
    MaKeHoach: 'KH-001',
    TieuDe: 'Cắt tỉa cây xanh Quận Hải Châu',
    MaLoaiCongViec: 'pruning',
    NguoiLap: 'Nguyễn Văn A',
    NgayTao: '10/10/2024',
    TrangThai: 'approved',
    NguoiPheDuyet: 'Trần Thu Hà',
    MaXaPhuong: 'XP001',
    MaTuyenDuong: 'TD001',
  },
  {
    MaKeHoach: 'KH-002',
    TieuDe: 'Trồng mới cây tại đường Bạch Đằng',
    MaLoaiCongViec: 'planting',
    NguoiLap: 'Nguyễn Văn A',
    NgayTao: '12/10/2024',
    TrangThai: 'rejected',
    NguoiPheDuyet: 'Lê Văn B',
    MaXaPhuong: 'XP002',
    MaTuyenDuong: 'TD001',
  },
  {
    MaKeHoach: 'KH-003',
    TieuDe: 'Xử lý cây nghiêng sau bão',
    MaLoaiCongViec: 'emergency',
    NguoiLap: 'Nguyễn Văn A',
    NgayTao: '14/10/2024',
    TrangThai: 'pending',
    MaXaPhuong: 'XP003',
    MaTuyenDuong: 'TD002',
  },
  {
    MaKeHoach: 'KH-004',
    TieuDe: 'Bón phân định kỳ Công viên 29/3',
    MaLoaiCongViec: 'maintenance',
    NguoiLap: 'Nguyễn Văn A',
    NgayTao: '15/10/2024',
    TrangThai: 'submitted',
    MaXaPhuong: 'XP004',
    MaTuyenDuong: 'TD003',
  },
];