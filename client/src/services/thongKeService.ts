import api from './api';
import { storage } from '../utils/storageUtils';

export interface ThongKeTongQuanResponse {
  tongQuan: {
    tongTao: number;
    tongDuyet: number;
    tongTuChoi: number;
    tongThamDinh: number;
    tongHuy: number;
  };
  chartData: Array<{
    date: string;
    fullDate: string;
    taoMoi: number;
    daDuyet: number;
    tuChoi: number;
    dangThamDinh: number;
    daHuy: number;
  }>;
  rawData: any[];
}

const thongKeService = {
  getThongKeTongQuan: async (
    tuNgay?: string,
    denNgay?: string,
    maTuyenDuong?: string,
    maXaPhuong?: string,
    loaiNgay?: string,
    maLoaiCongViec?: string,
    trangThai?: string
  ): Promise<ThongKeTongQuanResponse> => {
    const params = new URLSearchParams();
    if (tuNgay) params.append('tuNgay', tuNgay);
    if (denNgay) params.append('denNgay', denNgay);
    if (maTuyenDuong) params.append('maTuyenDuong', maTuyenDuong);
    if (maXaPhuong) params.append('maXaPhuong', maXaPhuong);
    if (loaiNgay) params.append('loaiNgay', loaiNgay);
    if (maLoaiCongViec) params.append('maLoaiCongViec', maLoaiCongViec);
    if (trangThai) params.append('trangThai', trangThai);

    const response = await api.get(`/thong-ke/tong-quan?${params.toString()}`);
    return response.data;
  },

  exportExcelUrl: (
    tuNgay?: string,
    denNgay?: string,
    maTuyenDuong?: string,
    maXaPhuong?: string,
    loaiNgay?: string,
    maLoaiCongViec?: string,
    trangThai?: string
  ): string => {
    const params = new URLSearchParams();
    if (tuNgay) params.append('tuNgay', tuNgay);
    if (denNgay) params.append('denNgay', denNgay);
    if (maTuyenDuong) params.append('maTuyenDuong', maTuyenDuong);
    if (maXaPhuong) params.append('maXaPhuong', maXaPhuong);
    if (loaiNgay) params.append('loaiNgay', loaiNgay);
    if (maLoaiCongViec) params.append('maLoaiCongViec', maLoaiCongViec);
    if (trangThai) params.append('trangThai', trangThai);
    
    return `http://localhost:5000/api/thong-ke/xuat-excel?${params.toString()}&token=${storage.getToken()}`;
  },

  exportPDFUrl: (
    tuNgay?: string,
    denNgay?: string,
    maTuyenDuong?: string,
    maXaPhuong?: string,
    loaiNgay?: string,
    maLoaiCongViec?: string,
    trangThai?: string
  ): string => {
    const params = new URLSearchParams();
    if (tuNgay) params.append('tuNgay', tuNgay);
    if (denNgay) params.append('denNgay', denNgay);
    if (maTuyenDuong) params.append('maTuyenDuong', maTuyenDuong);
    if (maXaPhuong) params.append('maXaPhuong', maXaPhuong);
    if (loaiNgay) params.append('loaiNgay', loaiNgay);
    if (maLoaiCongViec) params.append('maLoaiCongViec', maLoaiCongViec);
    if (trangThai) params.append('trangThai', trangThai);
    
    return `http://localhost:5000/api/thong-ke/xuat-pdf?${params.toString()}&token=${storage.getToken()}`;
  },

  downloadExcel: async (
    tuNgay?: string,
    denNgay?: string,
    maTuyenDuong?: string,
    maXaPhuong?: string,
    loaiNgay?: string,
    maLoaiCongViec?: string,
    trangThai?: string
  ) => {
    const params = new URLSearchParams();
    if (tuNgay) params.append('tuNgay', tuNgay);
    if (denNgay) params.append('denNgay', denNgay);
    if (maTuyenDuong) params.append('maTuyenDuong', maTuyenDuong);
    if (maXaPhuong) params.append('maXaPhuong', maXaPhuong);
    if (loaiNgay) params.append('loaiNgay', loaiNgay);
    if (maLoaiCongViec) params.append('maLoaiCongViec', maLoaiCongViec);
    if (trangThai) params.append('trangThai', trangThai);

    const response = await api.get(`/thong-ke/xuat-excel?${params.toString()}`, {
      responseType: 'blob',
    });
    
    return response.data;
  },
  
  downloadPDF: async (
    tuNgay?: string,
    denNgay?: string,
    maTuyenDuong?: string,
    maXaPhuong?: string,
    loaiNgay?: string,
    maLoaiCongViec?: string,
    trangThai?: string
  ) => {
    const params = new URLSearchParams();
    if (tuNgay) params.append('tuNgay', tuNgay);
    if (denNgay) params.append('denNgay', denNgay);
    if (maTuyenDuong) params.append('maTuyenDuong', maTuyenDuong);
    if (maXaPhuong) params.append('maXaPhuong', maXaPhuong);
    if (loaiNgay) params.append('loaiNgay', loaiNgay);
    if (maLoaiCongViec) params.append('maLoaiCongViec', maLoaiCongViec);
    if (trangThai) params.append('trangThai', trangThai);

    const response = await api.get(`/thong-ke/xuat-pdf?${params.toString()}`, {
      responseType: 'blob',
    });
    
    return response.data;
  }
};

export default thongKeService;
