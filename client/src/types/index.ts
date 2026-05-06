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
  TenCongViec?: string;
  TenNguoiLap?: string;
  TenNguoiXuLy?: string;
  TenNguoiPheDuyet?: string;
  TenTuyenDuong?: string;
  TenXaPhuong?: string;
}

export interface DanhMucCayTrong {
  MaDMCay: string;
  TenCayTrong?: string;
  ChieuCaoTruongThanh?: number;
  DuongKinhTruongThanh?: number;
  HinhThucTanCay?: string;
  DangLa?: string;
  MauLa?: string;
  KyRungLa?: string;
  KyNoHoa?: string;
  MauHoa?: string;
  LoaiCay?: string;
  MoTa?: string;
  TrangThai?: string;
  NgayTao?: string;
  NgayCapNhat?: string;
}

export interface CayXanh {
  MaCay: string;
  MaDMCay?: string;
  NgayTrong?: string;
  NguonGoc?: string;
  ChieuCaoHienTai?: number;
  DuongKinhThanHienTai?: number;
  DuongKinhTanHienTai?: number;
  TrangThaiSucKhoe?: string;
  KinhDo?: string;
  ViDo?: string;
  GhiChu?: string;
  NgayTao?: string;
  NgayCapNhat?: string;
  MaTuyenDuong?: string;
  MaNguoiCapNhat?: string;
}

export interface FilterParams {
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  dateType: 'NgayTao' | 'NgayCapNhat' | 'NgayPheDuyet';
  jobType: string;
  processor: string;
  xaPhuong: string;
  tuyenDuong: string;
}

export interface SummaryStats {
  daGui: number;
  dangThamDinh: number;
  duocDuyet: number;
  biTuChoi: number;
  daHuy: number;
  total: number;
}