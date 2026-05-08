import api from './api';
import type { XaPhuong, TuyenDuong } from '../types';

export const LocationService = {
  /**
   * Lấy danh sách xã phường từ server
   */
  getXaPhuongList: async (): Promise<XaPhuong[]> => {
    try {
      const response = await api.get('/locations/xa-phuong');
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách xã phường:', error);
      return [];
    }
  },

  /**
   * Lấy danh sách tuyến đường theo mã xã phường từ server
   * @param maXaPhuong 
   */
  getTuyenDuongList: async (maXaPhuong: string): Promise<TuyenDuong[]> => {
    if (!maXaPhuong) return [];
    try {
      const response = await api.get(`/locations/tuyen-duong/${maXaPhuong}`);
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tuyến đường:', error);
      return [];
    }
  },

  getAllTuyenDuong: async (): Promise<any> => {
    try {
      const response = await api.get(`/locations/tuyen-duong`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy tất cả tuyến đường:', error);
      return { data: [] };
    }
  },
  
  getXaPhuong: async (): Promise<any> => {
    try {
      const response = await api.get('/locations/xa-phuong');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách xã phường:', error);
      return { data: [] };
    }
  }
};

export default LocationService;
