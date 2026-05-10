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

  // Quick Reject Modal State
  const [quickRejectModal, setQuickRejectModal] = useState<{ isOpen: boolean; planId: string; planTitle?: string }>({ isOpen: false, planId: '' });
  const [quickRejectReason, setQuickRejectReason] = useState('');

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
      alert(`${status === 'Đã phê duyệt' ? 'Phê duyệt' : 'Từ chối'} kế hoạch thành công!`);
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };

  const handleQuickUpdate = async (id: string, status: string, planTitle?: string) => {
    if (status === 'Bị từ chối') {
      setQuickRejectModal({ isOpen: true, planId: id, planTitle });
      setQuickRejectReason('');
      return;
    }

    try {
      await PheDuyetService.updateTrangThaiPheDuyet(id, status, '', 'aB3kL9pQx2mV8nZ1cY5t');
      fetchPlans(currentPage, currentFilters);
    } catch (error) {
      alert('Có lỗi xảy ra.');
    }
  };

  const submitQuickReject = async () => {
    if (!quickRejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối.');
      return;
    }
    try {
      await PheDuyetService.updateTrangThaiPheDuyet(
        quickRejectModal.planId,
        'Bị từ chối',
        quickRejectReason,
        'aB3kL9pQx2mV8nZ1cY5t'
      );
      setQuickRejectModal({ isOpen: false, planId: '' });
      fetchPlans(currentPage, currentFilters);
      alert('Từ chối kế hoạch thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra.');
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
            onQuickUpdate={handleQuickUpdate}
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

      {/* Quick Reject Modal */}
      {quickRejectModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[440px] overflow-hidden transform transition-all m-4 border border-slate-100 animate-fade-in-up" style={{ padding: '0' }}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/80" style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <span className="material-symbols-outlined text-orange-500 bg-orange-100/50 p-1.5 rounded-full text-[20px]">warning</span>
              <h3 className="text-lg font-bold text-slate-800" style={{ margin: 0 }}>Lý do từ chối</h3>
            </div>
            
            {/* Body */}
            <div className="p-6" style={{ padding: '24px' }}>
              <div className="mb-5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Kế hoạch đang xử lý:</div>
                <div className="font-medium text-slate-800 text-sm flex items-start gap-2">
                  <span className="text-emerald-600 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">#{quickRejectModal.planId}</span>
                  <span className="leading-snug">{quickRejectModal.planTitle}</span>
                </div>
              </div>

              <textarea
                className="w-full border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none mb-2 transition-all duration-300 resize-none text-slate-700 placeholder:text-slate-400 text-sm bg-slate-50 focus:bg-white"
                rows={4}
                style={{ padding: '16px 24px' }}
                placeholder="Vui lòng nhập chi tiết lý do từ chối kế hoạch này..."
                value={quickRejectReason}
                onChange={(e) => setQuickRejectReason(e.target.value)}
              />
              {!quickRejectReason.trim() && (
                <p className="text-xs text-rose-500 mb-5 pl-1 transition-all">* Bắt buộc nhập lý do từ chối</p>
              )}
              {quickRejectReason.trim() && <div className="h-4 mb-5"></div>}
              
              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2" style={{ paddingTop: '16px', marginTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <button 
                  className="rounded-xl transition-all font-semibold text-sm shadow-sm"
                  style={{ backgroundColor: '#ffffff', color: '#475569', border: '1px solid #e2e8f0', cursor: 'pointer', padding: '10px 24px' }}
                  onClick={() => setQuickRejectModal({ isOpen: false, planId: '' })}
                >
                  Hủy bỏ
                </button>
                <button 
                  className="rounded-xl transition-all font-semibold shadow-sm text-sm flex items-center justify-center"
                  style={{ backgroundColor: '#e11d48', color: '#ffffff', border: 'none', cursor: 'pointer', padding: '10px 24px' }}
                  onClick={submitQuickReject}
                >
                  Xác nhận từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PheDuyetKeHoach;
