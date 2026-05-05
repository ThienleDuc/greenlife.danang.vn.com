// src/pages/TheoDoiTrangThaiKeHoach.tsx
import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import PlanTable from '../components/PlanTable';
import SummaryStatsComponent from '../components/SummaryStats';
import Pagination from '../components/Pagination';
import { TheoDoiKeHoachService } from '../services/TheoDoiKeHoach';
import type { KeHoachCongViec, FilterParams, SummaryStats } from '../types';

const TheoDoiTrangThaiKeHoach: React.FC = () => {
  const [plans, setPlans] = useState<KeHoachCongViec[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<KeHoachCongViec[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    completed: 0,
    completedChange: 0,
    processing: 0,
    pending: 0,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const data = await TheoDoiKeHoachService.getKeHoachList();
      setPlans(data);
      setFilteredPlans(data);

      const stats = await TheoDoiKeHoachService.getSummaryStats();
      setSummaryStats(stats);
    };
    
    fetchData();
  }, []);

  const handleSearch = (params: FilterParams) => {
    const filtered = TheoDoiKeHoachService.filterKeHoach(plans, params);
    setFilteredPlans(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilteredPlans(plans);
    setCurrentPage(1);
  };

  const handleViewDetail = (plan: KeHoachCongViec) => {
    console.log('View detail:', plan);
    alert(`Xem chi tiết kế hoạch: ${plan.TieuDe}`);
  };

  const handleEdit = (plan: KeHoachCongViec) => {
    console.log('Edit plan:', plan);
    alert(`Chỉnh sửa kế hoạch: ${plan.TieuDe}`);
  };

  const handleCancel = (plan: KeHoachCongViec) => {
    console.log('Cancel plan:', plan);
    if (confirm(`Bạn có chắc muốn hủy kế hoạch: ${plan.TieuDe}?`)) {
      alert(`Đã hủy kế hoạch: ${plan.TieuDe}`);
    }
  };

  const handleCreateNew = () => {
    alert('Tạo kế hoạch mới');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage) || 1;

  return (
    <div className="plan-tracking-page">
      {/* Header Section */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Theo dõi trạng thái kế hoạch</h1>
          <p className="page-subtitle">
            Quản lý và cập nhật tiến độ các kế hoạch hạ tầng xanh tại khu vực Đà Nẵng.
          </p>
        </div>
        <button
          className="btn-create-plan"
          onClick={handleCreateNew}
        >
          <span className="material-symbols-outlined">add</span>
          Tạo kế hoạch mới
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar onSearch={handleSearch} onReset={handleReset} />

      {/* Plan Table */}
      <PlanTable
        plans={currentPlans}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onCancel={handleCancel}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredPlans.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Summary Stats */}
      <SummaryStatsComponent stats={summaryStats} />
    </div>
  );
};

export default TheoDoiTrangThaiKeHoach;