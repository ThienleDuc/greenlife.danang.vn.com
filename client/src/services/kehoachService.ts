import type { FilterParams, SummaryStats } from '../types';
import api from './api';

const MOCK_SUMMARY_STATS: SummaryStats = {
  daGui: 5,
  dangThamDinh: 3,
  duocDuyet: 10,
  biTuChoi: 1,
  daHuy: 1,
  total: 20,
};

export const TheoDoiKeHoachService = {
  // Gọi API lấy danh sách kế hoạch từ server
  getKeHoachList: async (limit = 10, offset = 0): Promise<any> => {
    try {
      const response = await api.get('/ke-hoach', { params: { limit, offset } });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách kế hoạch:', error);
      return { data: [], total: 0 };
    }
  },

  // Gọi API tìm kiếm đa năng từ server
  searchKeHoach: async (filters: FilterParams, limit = 10, offset = 0): Promise<any> => {
    try {
      const response = await api.get('/ke-hoach/search', { 
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

  // Giả lập API gọi lấy thống kê
  getSummaryStats: async (): Promise<SummaryStats> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...MOCK_SUMMARY_STATS });
      }, 300);
    });
  }
};
