// src/components/PlanTable.tsx
import React from 'react';
import type { KeHoachCongViec } from '../types';
import { PLAN_TYPES, PLAN_STATUS } from '../constants/constants';

interface PlanTableProps {
  plans: KeHoachCongViec[];
  onViewDetail: (plan: KeHoachCongViec) => void;
  onEdit?: (plan: KeHoachCongViec) => void;
  onCancel?: (plan: KeHoachCongViec) => void;
}

const PlanTable: React.FC<PlanTableProps> = ({ plans, onViewDetail, onEdit, onCancel }) => {
  return (
    <div className="plan-table-container">
      <div className="plan-table-scroll">
        <table className="plan-table">
          <thead>
            <tr>
              <th>Mã kế hoạch</th>
              <th>Tiêu đề kế hoạch</th>
              <th>Loại công việc</th>
              <th>Người lập &amp; Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Phê duyệt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => {
              const typeInfo = PLAN_TYPES[plan.MaLoaiCongViec as keyof typeof PLAN_TYPES] || { label: plan.MaLoaiCongViec, color: 'bg-slate-100 text-slate-700' };
              const statusInfo = PLAN_STATUS[plan.TrangThai as keyof typeof PLAN_STATUS] || { label: plan.TrangThai, color: 'bg-slate-100 text-slate-700' };
              const creatorName = plan.NguoiLap || 'Chưa rõ';
              const canEdit = plan.TrangThai !== 'approved';
              const canCancel = plan.TrangThai === 'pending' || plan.TrangThai === 'submitted';

              return (
                <tr key={plan.MaKeHoach}>
                  <td className="plan-code">
                    {plan.MaKeHoach}
                  </td>
                  <td>
                    <p className="plan-title">{plan.TieuDe}</p>
                  </td>
                  <td>
                    <span className={`plan-type-badge ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </td>
                  <td>
                    <div className="plan-creator">
                      <div className="plan-creator-avatar">
                        {creatorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="plan-creator-name">{creatorName}</p>
                        <p className="plan-creator-date">{plan.NgayTao}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`plan-status-badge plan-status-${plan.TrangThai}`}>
                      <span className="plan-status-dot"></span>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="plan-approver">
                    {plan.NguoiPheDuyet || <span className="plan-approver-pending">Đang chờ</span>}
                  </td>
                  <td>
                    <div className="plan-actions">
                      <button
                        className="plan-action-btn"
                        title="Xem chi tiết"
                        onClick={() => onViewDetail(plan)}
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                      {canEdit && onEdit && (
                        <button
                          className="plan-action-btn plan-action-btn-edit"
                          title="Chỉnh sửa"
                          onClick={() => onEdit(plan)}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      )}
                      {canCancel && onCancel && (
                        <button
                          className="plan-action-btn plan-action-btn-cancel"
                          title="Hủy bỏ"
                          onClick={() => onCancel(plan)}
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanTable;