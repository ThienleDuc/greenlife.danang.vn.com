import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import ApprovalTable from '../components/ApprovalTable';
import ApprovalDetailModal from '../components/ApprovalDetailModal';
import Pagination from '../components/Pagination';
import { PheDuyetService } from '../services/pheDuyetService';
import type { KeHoachCongViec, FilterParams, KeHoachChiTietResponse } from '../types';

const PheDuyetKeHoach: React.FC = () => {
  const [plans, setPlans] = useState<KeHoachCongViec[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState<FilterParams | null>(null);
  const itemsPerPage = 10;

  // Detail Modal State
  const [selectedPlanDetail, setSelectedPlanDetail] = useState<KeHoachChiTietResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const fetchPlans = async (page: number, filters: FilterParams | null) => {
    const offset = (page - 1) * itemsPerPage;
    let result;

    if (filters) {
      result = await PheDuyetService.searchKeHoachPheDuyet(filters, itemsPerPage, offset);
    } else {
      result = await PheDuyetService.getKeHoachPheDuyet(itemsPerPage, offset);
    }

    if (result) {
      setPlans(result.data || []);
      setTotalItems(result.total || 0);
    }
  };

  useEffect(() => {
    fetchPlans(currentPage, currentFilters);
  }, [currentPage, currentFilters]);

  const handleSearch = (params: FilterParams) => {
    setCurrentFilters(params);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setCurrentFilters(null);
    setCurrentPage(1);
  };

  const handleViewDetail = async (plan: KeHoachCongViec) => {
    try {
      const detail = await PheDuyetService.getKeHoachChiTiet(plan.MaKeHoach);
      if (detail) {
        setSelectedPlanDetail(detail);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching plan detail:', error);
      alert('Lỗi hệ thống khi lấy thông tin chi tiết.');
    }
  };

  const handleApprove = async (status: string, feedback: string, file?: File, removeFiles?: string[]) => {
    if (!selectedPlanDetail) return;

    try {
      // Mocking current user as 'Quản lý cấp cao'
      await PheDuyetService.updateTrangThaiPheDuyet(
        selectedPlanDetail.keHoach.MaKeHoach,
        status,
        feedback,
        'aB3kL9pQx2mV8nZ1cY5t', // Mock ID
        file,
        removeFiles
      );

      setIsModalOpen(false);
      fetchPlans(currentPage, currentFilters);
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };


  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  return (
    <div className="approval-page">
      <div className="page-header">
        <div>
          <h1 className="page-title text-3xl font-extrabold text-slate-800">Phê duyệt kế hoạch</h1>
          <p className="page-subtitle text-slate-500">
            Quản lý và xét duyệt các kế hoạch bảo dưỡng, trồng mới từ đội ngũ kỹ thuật.
          </p>
        </div>
      </div>

      <div className="page-content-grid">
        <aside className="page-sidebar">
          <FilterBar onSearch={handleSearch} onReset={handleReset} />
        </aside>

        <main className="page-main-content">
          <ApprovalTable
            plans={plans}
            onViewDetail={handleViewDetail}
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

      <ApprovalDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedPlanDetail}
        onApprove={handleApprove}
      />


    </div>
  );
};

export default PheDuyetKeHoach;
