import type { FilterParams, SummaryStats } from '../types';
import api from './api';


export const TheoDoiKeHoachService = {
  // Gọi API tìm kiếm đa năng từ server
  searchKeHoach: async (filters: Partial<FilterParams>, limit = 10, offset = 0): Promise<any> => {
    try {
      const response = await api.get('/ke-hoach', { 
        params: { ...filters, limit, offset } 
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm kế hoạch:', error);
      return { data: [], total: 0 };
    }
  },

  // Gọi API lấy danh sách danh mục công việc
  getDanhMucCongViec: async (): Promise<any[]> => {
    try {
      const response = await api.get('/danh-muc-cong-viec');
      return response.data || [];
    } catch (error) {
      console.error('Lỗi khi lấy danh mục công việc:', error);
      return [];
    }
  },

  // Gọi API lấy thống kê từ server
  getSummaryStats: async (): Promise<SummaryStats> => {
    try {
      const response = await api.get('/ke-hoach/stats');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thống kê kế hoạch:', error);
      return {
        daGui: 0,
        dangThamDinh: 0,
        daPheDuyet: 0,
        biTuChoi: 0,
        daHuy: 0,
        total: 0
      };
    }
  }
};
