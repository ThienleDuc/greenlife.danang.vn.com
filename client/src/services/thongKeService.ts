import axios from 'axios';
import { storage } from '../utils/storageUtils';

const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = storage.getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface ThongKeTongQuanResponse {
  tongQuan: {
    tongTao: number;
    tongDuyet: number;
    tongTuChoi: number;
  };
  chartData: Array<{
    date: string;
    taoMoi: number;
    daDuyet: number;
    tuChoi: number;
    dangThamDinh: number;
  }>;
  rawData: any[];
}

const thongKeService = {
  getThongKeTongQuan: async (tuNgay?: string, denNgay?: string, maTuyenDuong?: string, maXaPhuong?: string): Promise<ThongKeTongQuanResponse> => {
    const params = new URLSearchParams();
    if (tuNgay) params.append('tuNgay', tuNgay);
    if (denNgay) params.append('denNgay', denNgay);
    if (maTuyenDuong) params.append('maTuyenDuong', maTuyenDuong);
    if (maXaPhuong) params.append('maXaPhuong', maXaPhuong);

    const response = await axios.get(`${API_URL}/thong-ke/tong-quan?${params.toString()}`, {
      headers: getHeaders()
    });
    return response.data;
  },

  exportExcelUrl: (tuNgay?: string, denNgay?: string, maTuyenDuong?: string, maXaPhuong?: string): string => {
    const params = new URLSearchParams();
    if (tuNgay) params.append('tuNgay', tuNgay);
    if (denNgay) params.append('denNgay', denNgay);
    if (maTuyenDuong) params.append('maTuyenDuong', maTuyenDuong);
    if (maXaPhuong) params.append('maXaPhuong', maXaPhuong);
    
    // Add token for authentication since we are opening it in a new window/tab
    // We could either send it in query string if backend supports it, or use blob download
    return `${API_URL}/thong-ke/xuat-excel?${params.toString()}&token=${storage.getToken()}`;
  },

  exportPDFUrl: (tuNgay?: string, denNgay?: string, maTuyenDuong?: string, maXaPhuong?: string): string => {
    const params = new URLSearchParams();
    if (tuNgay) params.append('tuNgay', tuNgay);
    if (denNgay) params.append('denNgay', denNgay);
    if (maTuyenDuong) params.append('maTuyenDuong', maTuyenDuong);
    if (maXaPhuong) params.append('maXaPhuong', maXaPhuong);
    
    return `${API_URL}/thong-ke/xuat-pdf?${params.toString()}&token=${storage.getToken()}`;
  },

  // Helper method if you want to download via Blob instead of window.open
  downloadExcel: async (tuNgay?: string, denNgay?: string, maTuyenDuong?: string, maXaPhuong?: string) => {
    const params = new URLSearchParams();
    if (tuNgay) params.append('tuNgay', tuNgay);
    if (denNgay) params.append('denNgay', denNgay);
    if (maTuyenDuong) params.append('maTuyenDuong', maTuyenDuong);
    if (maXaPhuong) params.append('maXaPhuong', maXaPhuong);

    const response = await axios.get(`${API_URL}/thong-ke/xuat-excel?${params.toString()}`, {
      headers: getHeaders(),
      responseType: 'blob',
    });
    
    return response.data;
  },
  
  downloadPDF: async (tuNgay?: string, denNgay?: string, maTuyenDuong?: string, maXaPhuong?: string) => {
    const params = new URLSearchParams();
    if (tuNgay) params.append('tuNgay', tuNgay);
    if (denNgay) params.append('denNgay', denNgay);
    if (maTuyenDuong) params.append('maTuyenDuong', maTuyenDuong);
    if (maXaPhuong) params.append('maXaPhuong', maXaPhuong);

    const response = await axios.get(`${API_URL}/thong-ke/xuat-pdf?${params.toString()}`, {
      headers: getHeaders(),
      responseType: 'blob',
    });
    
    return response.data;
  }
};

export default thongKeService;
