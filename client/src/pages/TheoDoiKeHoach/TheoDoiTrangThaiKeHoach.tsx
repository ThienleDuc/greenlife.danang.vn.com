import React, { useState, useEffect } from 'react';
import FilterBar from '../../components/FilterBar';
import PlanTable from '../../components/PlanTable';
import SummaryStatsComponent from '../../components/SummaryStats';
import Pagination from '../../components/Pagination';
import { TheoDoiKeHoachService } from '../../services/kehoachService';
import type { KeHoachCongViec, FilterParams } from '../../types';

const TheoDoiTrangThaiKeHoach: React.FC = () => {
  const [plans, setPlans] = useState<KeHoachCongViec[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState<FilterParams | null>(null);
  const itemsPerPage = 10;

  const fetchPlans = async (page: number, filters: FilterParams | null) => {
    const offset = (page - 1) * itemsPerPage;
    let result;
    
    if (filters) {
      result = await TheoDoiKeHoachService.searchKeHoach(filters, itemsPerPage, offset);
    } else {
      result = await TheoDoiKeHoachService.getKeHoachList(itemsPerPage, offset);
    }

    if (result) {
      setPlans(result.data || []);
      setTotalItems(result.total || 0);
    }
  };

  useEffect(() => {
    fetchPlans(1, null);
  }, []);

  // Re-fetch when page or filters change
  useEffect(() => {
    fetchPlans(currentPage, currentFilters);
  }, [currentPage, currentFilters]);

  const handleSearch = (params: FilterParams) => {
    setCurrentFilters(params);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleReset = () => {
    setCurrentFilters(null);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

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
      </div>

      {/* Summary Stats - Top */}
      <SummaryStatsComponent />

      <div className="page-content-grid">
        {/* Left Sidebar - Filter */}
        <aside className="page-sidebar">
          <FilterBar onSearch={handleSearch} onReset={handleReset} />
        </aside>

        {/* Right Content - Table */}
        <main className="page-main-content">
          <PlanTable
            plans={plans}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </div>
  );
};

export default TheoDoiTrangThaiKeHoach;