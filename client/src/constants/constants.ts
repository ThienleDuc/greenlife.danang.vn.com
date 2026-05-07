import type { KeHoachCongViec } from '../types';

export const PLAN_TYPES = {
  pruning: { label: 'Cắt tỉa', color: 'bg-slate-100 text-slate-700' },
  planting: { label: 'Trồng mới', color: 'bg-slate-100 text-slate-700' },
  emergency: { label: 'Xử lý sự cố', color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  maintenance: { label: 'Bảo dưỡng', color: 'bg-slate-100 text-slate-700' },
};

export const PLAN_STATUS = {
  'Đã gửi': { label: 'Đã gửi', color: 'bg-blue-50 text-blue-700', dotColor: 'bg-blue-500' },
  'Đang thẩm định': { label: 'Đang thẩm định', color: 'bg-orange-100 text-orange-700', dotColor: 'bg-orange-400' },
  'Đã phê duyệt': { label: 'Đã phê duyệt', color: 'bg-emerald-50 text-emerald-700', dotColor: 'bg-emerald-500' },
  'Bị từ chối': { label: 'Bị từ chối', color: 'bg-red-50 text-red-700', dotColor: 'bg-red-500' },
  'Đã hủy': { label: 'Đã hủy', color: 'bg-slate-100 text-slate-700', dotColor: 'bg-slate-400' },
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
    NgayTao: '2024-10-10',
    TrangThai: 'Đã phê duyệt',
    NguoiPheDuyet: 'Trần Thu Hà',
    MaTuyenDuong: 'TD001',
  },
  {
    MaKeHoach: 'KH-002',
    TieuDe: 'Trồng mới cây tại đường Bạch Đằng',
    MaLoaiCongViec: 'planting',
    NguoiLap: 'Nguyễn Văn A',
    NgayTao: '2024-10-12',
    TrangThai: 'Bị từ chối',
    NguoiPheDuyet: 'Lê Văn B',
    MaTuyenDuong: 'TD001',
  },
  {
    MaKeHoach: 'KH-003',
    TieuDe: 'Xử lý cây nghiêng sau bão',
    MaLoaiCongViec: 'emergency',
    NguoiLap: 'Nguyễn Văn A',
    NgayTao: '2024-10-14',
    TrangThai: 'Đang thẩm định',
    MaTuyenDuong: 'TD002',
  },
  {
    MaKeHoach: 'KH-004',
    TieuDe: 'Bón phân định kỳ Công viên 29/3',
    MaLoaiCongViec: 'maintenance',
    NguoiLap: 'Nguyễn Văn A',
    NgayTao: '2024-10-15',
    TrangThai: 'Đã gửi',
    MaTuyenDuong: 'TD003',
  },
];