import React from 'react';
import type { KeHoachCongViec } from '../types';
import { PLAN_TYPES, PLAN_STATUS } from '../constants/constants';

interface PlanTableProps {
  plans: KeHoachCongViec[];
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const PlanTable: React.FC<PlanTableProps> = ({ plans }) => {
  const openPdf = (fileUrl?: string) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="plan-list-container">
      <div className="plan-cards-grid">
        {plans.map((plan) => {
          const typeLabel = plan.TenCongViec || (PLAN_TYPES[plan.MaLoaiCongViec as keyof typeof PLAN_TYPES]?.label) || plan.MaLoaiCongViec;
          const statusInfo = PLAN_STATUS[plan.TrangThai as keyof typeof PLAN_STATUS] || { label: plan.TrangThai, color: 'bg-slate-100 text-slate-700' };
          const creatorName = plan.TenNguoiLap || plan.NguoiLap || 'Chưa rõ';
          const processorName = plan.TenNguoiXuLy || plan.NguoiXuLy || 'Đang cập nhật';
          const approverName = plan.TenNguoiPheDuyet || plan.NguoiPheDuyet || '---';

          return (
            <article key={plan.MaKeHoach} className="plan-card">
              <div className="plan-card-header">
                <div className="header-left">
                  <span className={`plan-status-badge plan-status-${plan.TrangThai}`}>
                    <span className="plan-status-dot"></span>
                    {statusInfo.label}
                  </span>
                  <span className="plan-card-type-tag">{typeLabel}</span>
                </div>
                <span className="plan-card-code">#{plan.MaKeHoach}</span>
              </div>
              
              <div className="plan-card-body">
                <h3 className="plan-card-title">{plan.TieuDe}</h3>
                
                <div className="plan-route-info">
                  <span className="material-symbols-outlined">map</span>
                  <span className="label">Khu vực:</span>
                  <span className="value">
                    {plan.TenTuyenDuong 
                      ? `${plan.TenTuyenDuong}${plan.TenXaPhuong ? ` - ${plan.TenXaPhuong}` : ''}` 
                      : (plan.MaTuyenDuong || 'Chưa xác định')}
                  </span>
                </div>

                <p className="plan-card-description">
                  {plan.MoTa || 'Không có mô tả chi tiết cho kế hoạch này.'}
                </p>

                <div className="plan-personnel-section">
                  <h4 className="section-title">Nhân sự thực hiện</h4>
                  <div className="personnel-grid">
                    <div className="person-info">
                      <div className="person-avatar">{creatorName.charAt(0).toUpperCase()}</div>
                      <div className="person-details">
                        <span className="role">Người lập</span>
                        <span className="name">{creatorName}</span>
                        <span className="date">{formatDate(plan.NgayTao)}</span>
                      </div>
                    </div>

                    <div className="person-info">
                      <div className="person-avatar processor">{processorName.charAt(0).toUpperCase()}</div>
                      <div className="person-details">
                        <span className="role">Người xử lý</span>
                        <span className="name">{processorName}</span>
                        <span className="date">{formatDate(plan.NgayXuLy)}</span>
                      </div>
                    </div>

                    <div className="person-info">
                      <div className="person-avatar approver">{approverName.charAt(0).toUpperCase()}</div>
                      <div className="person-details">
                        <span className="role">Phê duyệt</span>
                        <span className="name">{approverName}</span>
                        <span className="date">{plan.NgayPheDuyet ? formatDate(plan.NgayPheDuyet) : '---'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {plan.YKienPheDuyet && (
                  <div className="plan-feedback-box">
                    <div className="feedback-header">
                      <span className="material-symbols-outlined">comment</span>
                      <span>Ý kiến phê duyệt</span>
                    </div>
                    <p className="feedback-content">{plan.YKienPheDuyet}</p>
                  </div>
                )}
              </div>

              <div className="plan-card-footer-files">
                <div className="files-header">
                  <span className="material-symbols-outlined">attachment</span>
                  Tài liệu đính kèm
                </div>
                <div className="files-list">
                  {plan.FilePDFKeHoach && (
                    <button className="file-pill" onClick={() => openPdf(plan.FilePDFKeHoach)}>
                      <span className="material-symbols-outlined">picture_as_pdf</span>
                      Kế hoạch
                    </button>
                  )}
                  {plan.FilePDFDeNghiCapPhep && (
                    <button className="file-pill" onClick={() => openPdf(plan.FilePDFDeNghiCapPhep)}>
                      <span className="material-symbols-outlined">history_edu</span>
                      Cấp phép
                    </button>
                  )}
                  {plan.FilePDFBoSungKeHoach && (
                    <button className="file-pill" onClick={() => openPdf(plan.FilePDFBoSungKeHoach)}>
                      <span className="material-symbols-outlined">note_add</span>
                      Bổ sung
                    </button>
                  )}
                  {!plan.FilePDFKeHoach && !plan.FilePDFDeNghiCapPhep && !plan.FilePDFBoSungKeHoach && (
                    <span className="no-files">Không có tài liệu</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {plans.length === 0 && (
        <div className="no-plans-empty">
          <span className="material-symbols-outlined">folder_open</span>
          <p>Không tìm thấy kế hoạch nào phù hợp.</p>
        </div>
      )}
    </div>
  );
};

export default PlanTable;