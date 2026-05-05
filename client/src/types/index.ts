export interface QuyenHan {
  MaQuyen: string;
  TenQuyenHan?: string;
  MoTa?: string;
  Slug?: string;
  TenDanhMucCha?: string;
  Icon?: string;
}

export interface VaiTro {
  MaVaiTro: string;
  TenVaiTro?: string;
  MoTa?: string;
  Slug?: string;
  Icon?: string;
}

export interface GanQuyen {
  MaVaiTro: string;
  MaQuyen: string;
}

export interface XaPhuong {
  MaXaPhuong: string;
  MaHanhChinh?: number;
  TenXaPhuong?: string;
  LoaiDanhMuc?: string;
}

export interface TuyenDuong {
  MaTuyenDuong: string;
  TenTuyenDuong?: string;
  TenVietTat?: string;
  LoaiDuong?: string;
  MaXaPhuong?: string;
}

export interface NguoiDung {
  MaNguoiDung: string;
  TenDangNhap?: string;
  MatKhauHash?: string;
  HoTen?: string;
  Email?: string;
  SDT?: string;
  MaXaPhuong?: string;
  MaTuyenDuong?: string;
  DiaChi?: string;
  NgayTao?: string;
  NgayCapNhat?: string;
  MaVaiTro?: string;
}

export interface DanhMucCongViec {
  MaLoaiCongViec: string;
  TenCongViec?: string;
  MoTaCV?: string;
}

export interface KeHoachCongViec {
  MaKeHoach: string;
  MaLoaiCongViec?: string;
  TieuDe?: string;
  MoTa?: string;
  FilePDFKeHoach?: string;
  FilePDFDeNghiCapPhep?: string;
  NguoiLap?: string;
  TrangThai?: string;
  FilePDFBoSungKeHoach?: string;
  YKienPheDuyet?: string;
  NguoiPheDuyet?: string;
  NgayPheDuyet?: string;
  NgayTao?: string;
  NgayCapNhat?: string;
  NguoiXuLy?: string;
  NgayXuLy?: string;
  MaTuyenDuong?: string;
  MaXaPhuong?: string;
}

export interface FilterParams {
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  processor: string;
  xaPhuong: string;
  tuyenDuong: string;
}

export interface SummaryStats {
  completed: number;
  completedChange: number;
  processing: number;
  pending: number;
  total: number;
}