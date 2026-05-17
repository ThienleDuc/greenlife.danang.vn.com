import React from 'react';
import type { KeHoachCongViec } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  ClipboardList,
  MapPin,
  UserCircle2,
  CheckCircle2,
  XCircle,
  Clock3,
  FileSearch,
} from 'lucide-react';

interface ApprovalTableProps {
  plans: KeHoachCongViec[];
  onViewDetail: (plan: KeHoachCongViec) => void;
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'Đã phê duyệt':
      return {
        headerBg: 'bg-[#d1fae5]/40', // light emerald
        headerBorder: 'border-emerald-100',
        idColor: 'text-emerald-700/70',
        badgeBg: 'bg-white text-emerald-700 border border-emerald-200',
      };
    case 'Bị từ chối':
      return {
        headerBg: 'bg-[#ffe4e6]/40', // light rose
        headerBorder: 'border-rose-100',
        idColor: 'text-rose-700/70',
        badgeBg: 'bg-white text-rose-700 border border-rose-200',
      };
    case 'Đang chờ duyệt':
      return {
        headerBg: 'bg-[#fef3c7]/50', // light amber
        headerBorder: 'border-amber-100',
        idColor: 'text-amber-700/70',
        badgeBg: 'bg-white text-amber-700 border border-amber-200',
      };
    case 'Đang thẩm định':
      return {
        headerBg: 'bg-[#e0f2fe]/50', // light sky
        headerBorder: 'border-blue-100',
        idColor: 'text-blue-700/70',
        badgeBg: 'bg-white text-blue-700 border border-blue-200',
      };
    default:
      return {
        headerBg: 'bg-slate-50',
        headerBorder: 'border-slate-100',
        idColor: 'text-slate-500',
        badgeBg: 'bg-white text-slate-700 border border-slate-200',
      };
  }
};

const ApprovalTable: React.FC<ApprovalTableProps> = ({ plans, onViewDetail }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence>
        {plans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="col-span-full flex flex-col items-center justify-center p-16 bg-white/50 backdrop-blur-xl rounded-[24px] border border-slate-200/60 shadow-sm"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <ClipboardList className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
            </div>
            <p className="text-slate-600 font-medium text-lg tracking-tight">Không có kế hoạch nào cần xử lý</p>
            <p className="text-slate-400 text-sm mt-2">Mọi công việc đã được hoàn thành.</p>
          </motion.div>
        ) : (
          plans.map((plan, index) => {
            const config = getStatusConfig(plan.TrangThai || '');

            return (
              <motion.div
                key={plan.MaKeHoach}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => onViewDetail(plan)}
                className="group relative bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100/80 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Colored Header Block */}
                <div style={{ padding: '20px 28px' }} className={`flex justify-between items-center ${config.headerBg} border-b ${config.headerBorder}`}>
                  <span className={`inline-flex items-center text-[14px] font-bold ${config.idColor} tracking-widest font-mono`}>
                    #{plan.MaKeHoach}
                  </span>
                  <span
                    style={{ padding: '6px 14px' }}
                    className={`inline-flex items-center rounded-full text-[11px] font-bold tracking-wider ${config.badgeBg}`}
                  >
                    {plan.TrangThai?.toUpperCase()}
                  </span>
                </div>

                <div style={{ padding: '24px 28px' }} className="flex-grow flex flex-col">

                  {/* Title & Desc */}
                  <div className="mb-2">
                    <h3
                      className="font-extrabold text-slate-800 text-[19px] leading-[1.4] mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-500 transition-all duration-300"
                      title={plan.TieuDe}
                    >
                      {plan.TieuDe}
                    </h3>
                    <p className="text-[14.5px] text-slate-500/90 line-clamp-2 leading-relaxed" title={plan.MoTa}>
                      {plan.MoTa || <span className="italic opacity-70">Không có mô tả bổ sung...</span>}
                    </p>
                  </div>

                  <hr style={{ margin: '12px 0' }} className="border-slate-100/80" />

                  {/* Info List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="mb-2 mt-auto">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-slate-700">{plan.TenTuyenDuong}</span>
                        <span className="text-[12.5px] text-slate-400 font-medium">{plan.TenXaPhuong}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <UserCircle2 className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] text-slate-400 font-medium">Người lập</span>
                        <span className="text-[14px] font-medium text-slate-700">{plan.TenNguoiLap || plan.NguoiLap}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <CalendarDays className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] text-slate-400 font-medium">Ngày tạo</span>
                        <span className="text-[14px] font-medium text-slate-700">{formatDateTime(plan.NgayTao)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApprovalTable;
