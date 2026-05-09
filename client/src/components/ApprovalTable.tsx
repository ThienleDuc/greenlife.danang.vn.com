import React from 'react';
import type { KeHoachCongViec } from '../types';
import { PLAN_STATUS } from '../constants/constants';

interface ApprovalTableProps {
  plans: KeHoachCongViec[];
  onViewDetail: (plan: KeHoachCongViec) => void;
  onQuickUpdate: (id: string, status: string, planTitle?: string) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const ApprovalTable: React.FC<ApprovalTableProps> = ({ plans, onViewDetail, onQuickUpdate }) => {
  return (
    <div className="approval-table-container">
      <table className="approval-table">
        <thead>
          <tr>
            <th>Mã KH</th>
            <th>Tiêu đề</th>
            <th>Khu vực</th>
            <th>Người lập</th>
            <th>Ngày cập nhật</th>
            <th>Trạng thái</th>
            <th className="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => {
            const statusInfo = PLAN_STATUS[plan.TrangThai as keyof typeof PLAN_STATUS] || { label: plan.TrangThai, color: 'bg-slate-100 text-slate-700' };
            const isPendingApproval = plan.TrangThai === 'Đang chờ duyệt';
            const isDraft = plan.TrangThai === 'Đang thẩm định';

            return (
              <tr key={plan.MaKeHoach} className="hover:bg-slate-50 transition-colors">
                <td className="font-mono font-bold text-slate-500">#{plan.MaKeHoach}</td>
                <td>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">{plan.TieuDe}</span>
                    <span className="text-xs text-slate-400 truncate max-w-[200px]">{plan.MoTa}</span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col text-sm">
                    <span>{plan.TenTuyenDuong}</span>
                    <span className="text-xs text-slate-400">{plan.TenXaPhuong}</span>
                  </div>
                </td>
                <td>{plan.TenNguoiLap || plan.NguoiLap}</td>
                <td>{formatDate(plan.NgayCapNhat || plan.NgayTao)}</td>
                <td>
                  <span className={`status-badge-inline plan-status-${plan.TrangThai}`}>
                    {statusInfo.label}
                  </span>
                </td>
                <td>
                  <div className="flex justify-center gap-2">
                    <button
                      className="action-icon-btn info"
                      title="Xem chi tiết"
                      onClick={() => onViewDetail(plan)}
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </button>

                    {!isDraft && (
                      <>
                        {plan.TrangThai !== 'Đã phê duyệt' && (
                          <button
                            className="action-icon-btn approve"
                            title="Duyệt nhanh"
                            onClick={() => onQuickUpdate(plan.MaKeHoach, 'Đã phê duyệt')}
                          >
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                        )}
                        {plan.TrangThai !== 'Bị từ chối' && (
                          <button
                            className="action-icon-btn reject"
                            title="Từ chối nhanh"
                            onClick={() => onQuickUpdate(plan.MaKeHoach, 'Bị từ chối', plan.TieuDe)}
                          >
                            <span className="material-symbols-outlined">cancel</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {plans.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-10 text-slate-400 italic">
                Không tìm thấy kế hoạch nào cần phê duyệt.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalTable;
