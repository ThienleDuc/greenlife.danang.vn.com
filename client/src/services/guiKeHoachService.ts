import api from './api';
import type { DanhMucCongViec, KeHoachCongViec } from '../types';

export const GuiKeHoachService = {
  getDanhMucCongViec: async (): Promise<DanhMucCongViec[]> => {
    const response = await api.get('/danh-muc-cong-viec');
    return response.data || [];
  },

  getKeHoachCuaToi: async (): Promise<KeHoachCongViec[]> => {
    const response = await api.get('/ke-hoach/cua-toi');
    return response.data?.data || [];
  },

  getKeHoachByMa: async (maKeHoach: string): Promise<KeHoachCongViec> => {
    const response = await api.get(`/ke-hoach/${encodeURIComponent(maKeHoach)}`);
    return response.data?.data;
  },

  createKeHoach: async (formData: FormData): Promise<KeHoachCongViec> => {
    const response = await api.post('/ke-hoach', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data?.data;
  },

  updateKeHoach: async (
    maKeHoach: string,
    formData: FormData
  ): Promise<KeHoachCongViec> => {
    const response = await api.put(`/ke-hoach/${maKeHoach}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data?.data;
  },

  huyKeHoach: async (maKeHoach: string): Promise<KeHoachCongViec> => {
    const response = await api.patch(`/ke-hoach/${maKeHoach}/huy`);
    return response.data?.data;
  },
};
