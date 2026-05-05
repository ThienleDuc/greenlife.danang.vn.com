// src/components/FilterBar.tsx
import React, { useState } from 'react';
import type { FilterParams } from '../types';

interface FilterBarProps {
  onSearch: (params: FilterParams) => void;
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState<FilterParams>({
    title: '',
    status: 'Tất cả',
    startDate: '',
    endDate: '',
    processor: '',
    xaPhuong: '',
    tuyenDuong: '',
  });

  const handleInputChange = (field: keyof FilterParams, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      title: '',
      status: 'Tất cả',
      startDate: '',
      endDate: '',
      processor: '',
      xaPhuong: '',
      tuyenDuong: '',
    });
    onReset();
  };

  return (
    <section className="filter-section">
      <div className="filter-header">
        <span className="material-symbols-outlined">filter_alt</span>
        <h2 className="filter-title">
          Bộ lọc tìm kiếm
        </h2>
      </div>

      <div className="filter-grid">
        <div className="filter-field">
          <label className="filter-label">
            Tiêu đề kế hoạch
          </label>
          <div className="filter-input-icon">
            <span className="material-symbols-outlined">
              search
            </span>
            <input
              className="filter-input"
              placeholder="Tìm theo tiêu đề kế hoạch..."
              type="text"
              value={filters.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-field">
          <label className="filter-label">
            Trạng thái
          </label>
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option>Tất cả</option>
            <option>Đã gửi</option>
            <option>Đang thẩm định</option>
            <option>Được duyệt</option>
            <option>Bị từ chối</option>
          </select>
        </div>

        <div className="filter-field">
          <label className="filter-label">
            Khoảng thời gian
          </label>
          <div className="filter-date-range">
            <input
              className="filter-input"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
            <span className="filter-date-separator">→</span>
            <input
              className="filter-input"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-field">
          <label className="filter-label">
            Người lập/Xử lý
          </label>
          <input
            className="filter-input"
            placeholder="Tên nhân viên..."
            type="text"
            value={filters.processor}
            onChange={(e) => handleInputChange('processor', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-actions">
        <button
          className="filter-btn-reset"
          onClick={handleReset}
        >
          <span className="material-symbols-outlined">refresh</span>
          Làm mới
        </button>
        <button
          className="filter-btn-search"
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>
      </div>
    </section>
  );
};

export default FilterBar;