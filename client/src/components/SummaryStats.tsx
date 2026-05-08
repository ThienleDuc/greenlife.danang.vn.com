// src/components/SummaryStats.tsx
import React, { useState, useEffect } from 'react';
import type { SummaryStats } from '../types';
import { TheoDoiKeHoachService } from '../services/kehoachService';

const SummaryStatsComponent: React.FC = () => {
  const [stats, setStats] = useState<SummaryStats>({
    daGui: 0,
    dangThamDinh: 0,
    daPheDuyet: 0,
    biTuChoi: 0,
    daHuy: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await TheoDoiKeHoachService.getSummaryStats();
        setStats(data);
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      id: 'da-gui',
      title: 'Đã gửi',
      value: stats.daGui,
      extra: <span className="material-symbols-outlined text-blue-300">send</span>,
    },
    {
      id: 'dang-tham-dinh',
      title: 'Đang thẩm định',
      value: stats.dangThamDinh,
      extra: <span className="material-symbols-outlined text-orange-300">pending_actions</span>,
    },
    {
      id: 'da-phe-duyet',
      title: 'Đã phê duyệt',
      value: stats.daPheDuyet,
      extra: <span className="material-symbols-outlined text-green-300">check_circle</span>,
    },
    {
      id: 'bi-tu-choi',
      title: 'Bị từ chối',
      value: stats.biTuChoi,
      extra: <span className="material-symbols-outlined text-red-300">cancel</span>,
    },
    {
      id: 'da-huy',
      title: 'Đã hủy',
      value: stats.daHuy,
      extra: <span className="material-symbols-outlined text-gray-300">block</span>,
    },
    {
      id: 'total',
      title: 'Tổng số',
      value: stats.total,
      extra: <span className="material-symbols-outlined text-slate-300">inventory_2</span>,
    },
  ];

  if (loading) {
    return <div className="summary-stats-loading">Đang tải thống kê...</div>;
  }

  return (
    <div className="summary-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
      {statItems.map((item, index) => (
        <div key={index} className={`summary-stat-card ${item.id}`}>
          <p className="summary-stat-title">
            {item.title}
          </p>
          <div className="summary-stat-content">
            <span className="summary-stat-value">{item.value}</span>
            <span className="summary-stat-extra">{item.extra}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryStatsComponent;