// src/components/SummaryStats.tsx
import React from 'react';
import type { SummaryStats } from '../types';

interface SummaryStatsProps {
  stats: SummaryStats;
}

const SummaryStatsComponent: React.FC<SummaryStatsProps> = ({ stats }) => {
  const statItems = [
    {
      id: 'completed',
      title: 'Hoàn thành',
      value: stats.completed,
      extra: `+${stats.completedChange} tuần này`,
    },
    {
      id: 'processing',
      title: 'Đang xử lý',
      value: stats.processing,
      extra: <span className="material-symbols-outlined text-blue-300">pending_actions</span>,
    },
    {
      id: 'pending-review',
      title: 'Cần thẩm định',
      value: stats.pending,
      extra: <span className="material-symbols-outlined text-orange-300" data-weight="fill">priority_high</span>,
    },
    {
      id: 'total',
      title: 'Tổng số kế hoạch',
      value: stats.total,
      extra: <span className="material-symbols-outlined text-slate-300">inventory_2</span>,
    },
  ];

  return (
    <div className="summary-stats-grid">
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