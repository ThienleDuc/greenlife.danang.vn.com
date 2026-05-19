class KeHoachCongViec {
  constructor(data) {
    this.MaKeHoach = data.MaKeHoach;
    this.MaLoaiCongViec = data.MaLoaiCongViec;
    this.TenCongViec = data.TenCongViec; // Joined
    this.TieuDe = data.TieuDe;
    this.MoTa = data.MoTa;
    this.FilePDFKeHoach = data.FilePDFKeHoach;
    this.FilePDFDeNghiCapPhep = data.FilePDFDeNghiCapPhep;
    this.NguoiLap = data.NguoiLap;
    this.TenNguoiLap = data.TenNguoiLap; // Joined
    this.TrangThai = data.TrangThai;
    this.FilePDFBoSungKeHoach = data.FilePDFBoSungKeHoach;
    this.YKienPheDuyet = data.YKienPheDuyet;
    this.NguoiPheDuyet = data.NguoiPheDuyet;
    this.TenNguoiPheDuyet = data.TenNguoiPheDuyet; // Joined
    this.NgayPheDuyet = data.NgayPheDuyet;
    this.NgayTao = data.NgayTao;
    this.NgayCapNhat = data.NgayCapNhat;
    this.NguoiXuLy = data.NguoiXuLy;
    this.TenNguoiXuLy = data.TenNguoiXuLy; // Joined
    this.NgayXuLy = data.NgayXuLy;
    this.MaTuyenDuong = data.MaTuyenDuong;
    this.TenTuyenDuong = data.TenTuyenDuong;
    this.MaXaPhuong = data.MaXaPhuong;
    this.TenXaPhuong = data.TenXaPhuong;
  }
}

module.exports = KeHoachCongViec;
