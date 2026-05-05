import { MOCK_KE_HOACH, MOCK_XA_PHUONG, MOCK_TUYEN_DUONG } from '../constants/constants';
import type { KeHoachCongViec, FilterParams, SummaryStats, XaPhuong, TuyenDuong } from '../types';

const MOCK_SUMMARY_STATS: SummaryStats = {
  completed: 12,
  completedChange: 2,
  processing: 5,
  pending: 3,
  total: 24,
};

export const TheoDoiKeHoachService = {
  // Giả lập API gọi lấy danh sách kế hoạch
  getKeHoachList: async (): Promise<KeHoachCongViec[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_KE_HOACH]);
      }, 300);
    });
  },

  // Giả lập API gọi lấy thống kê
  getSummaryStats: async (): Promise<SummaryStats> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...MOCK_SUMMARY_STATS });
      }, 300);
    });
  },

  // Giả lập API gọi lấy danh sách xã/phường
  getXaPhuongList: async (): Promise<XaPhuong[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_XA_PHUONG] as XaPhuong[]);
      }, 300);
    });
  },

  // Giả lập API gọi lấy danh sách tuyến đường
  getTuyenDuongList: async (maXaPhuong?: string): Promise<TuyenDuong[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = maXaPhuong 
          ? MOCK_TUYEN_DUONG.filter(td => td.MaXaPhuong === maXaPhuong)
          : MOCK_TUYEN_DUONG;
        resolve([...list] as TuyenDuong[]);
      }, 300);
    });
  },

  // Hàm xử lý lọc dữ liệu (thường backend sẽ làm, nhưng tạm xử lý ở frontend theo service)
  filterKeHoach: (plans: KeHoachCongViec[], params: FilterParams): KeHoachCongViec[] => {
    let filtered = [...plans];

    if (params.title) {
      filtered = filtered.filter(plan =>
        plan.TieuDe?.toLowerCase().includes(params.title.toLowerCase())
      );
    }

    if (params.status && params.status !== 'Tất cả') {
      const statusMap: { [key: string]: string } = {
        'Đã gửi': 'submitted',
        'Đang thẩm định': 'pending',
        'Được duyệt': 'approved',
        'Bị từ chối': 'rejected',
      };
      filtered = filtered.filter(plan => plan.TrangThai === statusMap[params.status]);
    }

    if (params.processor) {
      filtered = filtered.filter(plan =>
        plan.NguoiLap?.toLowerCase().includes(params.processor.toLowerCase())
      );
    }

    if (params.xaPhuong) {
      filtered = filtered.filter(plan => plan.MaXaPhuong === params.xaPhuong);
    }

    if (params.tuyenDuong) {
      filtered = filtered.filter(plan => plan.MaTuyenDuong === params.tuyenDuong);
    }

    if (params.startDate || params.endDate) {
      filtered = filtered.filter(plan => {
        if (!plan.NgayTao) return false;
        
        // plan.NgayTao format is DD/MM/YYYY
        const [day, month, year] = plan.NgayTao.split('/');
        const planDate = new Date(`${year}-${month}-${day}`);
        
        if (params.startDate) {
          const start = new Date(params.startDate);
          if (planDate < start) return false;
        }
        
        if (params.endDate) {
          const end = new Date(params.endDate);
          end.setHours(23, 59, 59, 999);
          if (planDate > end) return false;
        }
        
        return true;
      });
    }

    return filtered;
  }
};
