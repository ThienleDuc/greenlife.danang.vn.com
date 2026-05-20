import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../../components/FilterBar';
import PlanTable from '../../components/PlanTable';
import Pagination from '../../components/Pagination';
import { TheoDoiKeHoachService } from '../../services/kehoachService';
import type { KeHoachCongViec, FilterParams } from '../../types';
import { getUserFromStorage, isKyThuat, isQuanLy } from '../../utils/roleUtils';
import { PATHS } from '../../utils/pathUtils';

const TheoDoiTrangThaiKeHoach: React.FC = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<KeHoachCongViec[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState<FilterParams | null>(null);
  const itemsPerPage = 10;

  // Re-fetch when page or filters change
  useEffect(() => {
    let isActive = true;

    const fetchPlans = async () => {
      const offset = (currentPage - 1) * itemsPerPage;
      const result = await TheoDoiKeHoachService.searchKeHoach(currentFilters || {}, itemsPerPage, offset);

      if (isActive && result) {
        setPlans(result.data || []);
        setTotalItems(result.total || 0);
      }
    };

    fetchPlans();

    return () => {
      isActive = false;
    };

  }, [currentPage, currentFilters]);

  const handleSearch = (params: FilterParams) => {
    setCurrentFilters(params);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleReset = () => {
    setCurrentFilters(null);
    setCurrentPage(1);
  };

  const handlePlanClick = (plan: KeHoachCongViec) => {
    const user = getUserFromStorage();
    if (isKyThuat(user)) {
      const targetPath = PATHS.KY_THUAT.CHINH_SUA_KE_HOACH.replace(':maKeHoach', encodeURIComponent(plan.MaKeHoach));
      navigate(targetPath);
    } else if (isQuanLy(user)) {
      const targetPath = PATHS.QUAN_LY.CHI_TIET_KE_HOACH.replace(':id', encodeURIComponent(plan.MaKeHoach));
      navigate(targetPath);
    }
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

      <div className="page-content-grid">
        {/* Left Sidebar - Filter */}
        <aside className="page-sidebar">
          <FilterBar onSearch={handleSearch} onReset={handleReset} />
        </aside>

        {/* Right Content - Table */}
        <main className="page-main-content">
          <PlanTable
            plans={plans}
            onPlanClick={handlePlanClick}
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
