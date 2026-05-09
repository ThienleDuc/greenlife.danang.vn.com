import api from './api';
import type { FilterParams, KeHoachChiTietResponse } from '../types';

export const PheDuyetService = {
  // Lấy danh sách kế hoạch cần phê duyệt
  getKeHoachPheDuyet: async (limit = 10, offset = 0): Promise<any> => {
    try {
      const response = await api.get('/phe-duyet/ke-hoach', { params: { limit, offset } });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách kế hoạch phê duyệt:', error);
      return { data: [], total: 0 };
    }
  },

  // Tìm kiếm kế hoạch phê duyệt
  searchKeHoachPheDuyet: async (filters: FilterParams, limit = 10, offset = 0): Promise<any> => {
    try {
      const response = await api.get('/phe-duyet/ke-hoach/search', { 
        params: { ...filters, limit, offset } 
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm kế hoạch phê duyệt:', error);
      return { data: [], total: 0 };
    }
  },

  // Lấy chi tiết kế hoạch
  getKeHoachChiTiet: async (maKeHoach: string): Promise<KeHoachChiTietResponse | null> => {
    try {
      const response = await api.get(`/phe-duyet/ke-hoach/${maKeHoach}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết kế hoạch:', error);
      return null;
    }
  },

  // Cập nhật trạng thái phê duyệt
  updateTrangThaiPheDuyet: async (
    maKeHoach: string, 
    trangThai: string, 
    yKienPheDuyet: string, 
    nguoiPheDuyet: string
  ): Promise<any> => {
    try {
      const response = await api.put(`/phe-duyet/ke-hoach/${maKeHoach}/trang-thai`, {
        trangThai,
        yKienPheDuyet,
        nguoiPheDuyet
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái phê duyệt:', error);
      throw error;
    }
  }
};
