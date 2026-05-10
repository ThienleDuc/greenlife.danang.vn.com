import React, { useState, useEffect } from 'react';
import type { KeHoachChiTietResponse, KeHoachPhanCong, ChiTietPhanCong } from '../types';
import { PLAN_STATUS } from '../constants/constants';
import { PheDuyetService } from '../services/pheDuyetService';

interface ApprovalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: KeHoachChiTietResponse | null;
  onApprove: (status: string, feedback: string, file?: File, removeFiles?: string[]) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'không có';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ApprovalDetailModal: React.FC<ApprovalDetailModalProps> = ({ isOpen, onClose, data, onApprove }) => {
  const [feedback, setFeedback] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [removeFiles, setRemoveFiles] = useState<string[]>([]);
  const [expandedPC, setExpandedPC] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && data) {
      setFeedback(data.keHoach.YKienPheDuyet || '');
      setSelectedFile(undefined); // Reset file selection for new action
      setRemoveFiles([]); // Reset removal list
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  const { keHoach, phanCongList } = data;
  const statusInfo = PLAN_STATUS[keHoach.TrangThai as keyof typeof PLAN_STATUS] || { label: keHoach.TrangThai, color: 'bg-slate-100 text-slate-700' };

  // Logic: "đang chờ thẩm định" is disabled for manager approval
  const isStatusDisabled = keHoach.TrangThai === 'Đang thẩm định';

  const togglePC = (id: string) => {
    setExpandedPC(expandedPC === id ? null : id);
  };

  const handleRemoveFile = async (fileKey: string, fileLabel: string, specificFilename?: string) => {
    const displayName = specificFilename ? `${fileLabel} (${specificFilename})` : fileLabel;
    if (!window.confirm(`Bạn có chắc chắn muốn gỡ bỏ "${displayName}" ngay lập tức không? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      await PheDuyetService.removeSpecificFile(keHoach.MaKeHoach, fileKey, specificFilename);
      
      // Update local data to reflect removal immediately
      if (data && data.keHoach) {
        if (specificFilename) {
          const currentFiles = (data.keHoach as any)[fileKey]?.split(',') || [];
          const updatedFiles = currentFiles.filter((f: string) => f !== specificFilename);
          (data.keHoach as any)[fileKey] = updatedFiles.length > 0 ? updatedFiles.join(',') : null;
        } else {
          (data.keHoach as any)[fileKey] = null;
        }
        // Force re-render
        setRemoveFiles(prev => [...prev, specificFilename || fileKey]);
      }
      alert('Đã gỡ tài liệu thành công!');
    } catch (error) {
      alert('Lỗi khi gỡ tài liệu. Vui lòng thử lại.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Chỉ chấp nhận file PDF');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  const renderFileLink = (file: { key: string, label: string, value: string, color: string }, index?: number) => {
    const isRemoved = removeFiles.includes(file.value) || removeFiles.includes(file.key);
    
    return (
      <div key={`${file.key}-${index || 0}`} className={`relative flex items-center transition-all duration-300 ${isRemoved ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
        <a 
          href={`/pdf/${file.value}`} 
          target="_blank" 
          rel="noreferrer" 
          className={`flex items-center gap-2 px-3 py-1.5 bg-${file.color}-50 text-${file.color}-700 hover:bg-${file.color}-100 border border-${file.color}-200 rounded-lg transition-all text-sm font-medium`}
        >
          <span className="material-symbols-outlined text-[18px]">{file.key === 'FilePDFBoSungKeHoach' ? 'description' : file.key === 'FilePDFDeNghiCapPhep' ? 'history_edu' : 'picture_as_pdf'}</span> 
          {file.label} {index !== undefined ? `#${index + 1}` : ''}
        </a>
        {!isStatusDisabled && !isRemoved && (
          <button 
            onClick={() => handleRemoveFile(file.key, file.label, file.key === 'FilePDFBoSungKeHoach' ? file.value : undefined)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-all flex-shrink-0 shadow-sm z-10 border border-white"
            style={{ backgroundColor: '#ef4444' }}
            title="Gỡ file này"
          >
            <span className="material-symbols-outlined text-[12px] font-bold">close</span>
          </button>
        )}
        {isRemoved && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-slate-800/80 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">Đã gỡ</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 md:p-6 transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] overflow-hidden transform transition-all border border-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/80 sticky top-0 z-10" style={{ padding: '24px 36px' }}>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
              Chi tiết kế hoạch
            </h2>
            <p className="text-slate-500 font-medium mt-1 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">article</span>
              {keHoach.TieuDe}
            </p>
          </div>
          <button 
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all p-2 rounded-full"
            onClick={onClose}
            title="Đóng"
          >
            <span className="material-symbols-outlined block text-[20px]">close</span>
          </button>
        </div>

        {/* Body with custom scrollbar */}
        <div className="overflow-y-auto bg-slate-50/50 flex-1 custom-scrollbar" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Main Info Section */}
          <div className="bg-white rounded-xl border shadow-sm" style={{ padding: '24px', borderColor: '#e2e8f0' }}>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 flex items-center gap-2" style={{ paddingBottom: '12px', marginBottom: '20px' }}>
              <span className="material-symbols-outlined text-emerald-500">info</span>
              Thông tin chung
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Cột 1 */}
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mã kế hoạch</span>
                  <div className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded w-max border border-slate-200">#{keHoach.MaKeHoach}</div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái</span>
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${keHoach.TrangThai === 'Bị từ chối' ? 'bg-rose-50 text-rose-600 border-rose-200' : keHoach.TrangThai === 'Đã phê duyệt' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ngày tạo</span>
                  <div className="font-medium text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">calendar_today</span>
                    {formatDate(keHoach.NgayTao)}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ngày cập nhật</span>
                  <div className="font-medium text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">update</span>
                    {formatDate(keHoach.NgayCapNhat)}
                  </div>
                </div>
              </div>

              {/* Cột 2 */}
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Người lập</span>
                  <div className="font-medium text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
                    {keHoach.TenNguoiLap || keHoach.NguoiLap}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Người xử lý</span>
                  <div className="font-medium text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">manage_accounts</span>
                    {keHoach.TenNguoiXuLy || keHoach.NguoiXuLy || '---'}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tuyến đường</span>
                  <div className="font-medium text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">route</span>
                    {keHoach.TenTuyenDuong}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Xã phường</span>
                  <div className="font-medium text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">location_city</span>
                    {keHoach.TenXaPhuong}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-5 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">description</span> Mô tả chi tiết
              </span>
              <div className="bg-slate-50/80 rounded-xl border border-slate-100 shadow-inner" style={{ padding: '16px 24px', margin: '0 -8px' }}>
                <p className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">
                  {keHoach.MoTa || <span className="italic text-slate-400">Không có mô tả</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div className="bg-white rounded-xl border shadow-sm" style={{ padding: '24px', borderColor: '#e2e8f0' }}>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 flex items-center gap-2" style={{ paddingBottom: '12px', marginBottom: '20px' }}>
              <span className="material-symbols-outlined text-blue-500">folder_open</span>
              Tài liệu đính kèm
            </h3>
            <div className="flex flex-wrap gap-4">
              {/* Render regular files */}
              {[
                { key: 'FilePDFKeHoach', label: 'Kế hoạch gốc', value: keHoach.FilePDFKeHoach, color: 'blue' },
                { key: 'FilePDFDeNghiCapPhep', label: 'Đề nghị cấp phép', value: keHoach.FilePDFDeNghiCapPhep, color: 'amber' },
              ].map(file => file.value && renderFileLink(file as any))}

              {/* Render supplementary files (multiple supported) */}
              {keHoach.FilePDFBoSungKeHoach && keHoach.FilePDFBoSungKeHoach.split(',').map((fileName, idx) => (
                renderFileLink({ 
                  key: 'FilePDFBoSungKeHoach', 
                  label: 'Kế hoạch bổ sung', 
                  value: fileName, 
                  color: 'indigo' 
                }, idx)
              ))}

              {(!keHoach.FilePDFKeHoach && !keHoach.FilePDFDeNghiCapPhep && !keHoach.FilePDFBoSungKeHoach) && (
                <span className="text-sm text-slate-500 italic bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">Không có tài liệu đính kèm.</span>
              )}
            </div>
          </div>

          {/* Assignment Section */}
          <div className="bg-white rounded-xl border shadow-sm" style={{ padding: '24px', borderColor: '#e2e8f0' }}>
            <div className="flex items-center justify-between border-b border-slate-100" style={{ paddingBottom: '12px', marginBottom: '20px' }}>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500">assignment</span>
                Kế hoạch phân công
              </h3>
              <span className="bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-xs font-bold shadow-sm">
                {phanCongList.length} phân công
              </span>
            </div>
            
            <div className="space-y-4">
              {phanCongList.length === 0 ? (
                <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <span className="material-symbols-outlined text-slate-300 text-4xl mb-2 block">assignment_late</span>
                  <p className="text-slate-500 text-sm">Chưa có thông tin phân công cho kế hoạch này.</p>
                </div>
              ) : (
                phanCongList.map((pc) => (
                  <div key={pc.MaKHPC} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-slate-300 transition-all">
                    <div
                      className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${expandedPC === pc.MaKHPC ? 'bg-slate-50 border-b border-slate-200' : 'bg-white hover:bg-slate-50'}`}
                      onClick={() => togglePC(pc.MaKHPC)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined transition-transform duration-300 text-slate-400 ${expandedPC === pc.MaKHPC ? 'rotate-90 text-emerald-600' : ''}`}>
                          chevron_right
                        </span>
                        <span className="font-bold text-slate-800 text-sm">{pc.TieuDe}</span>
                      </div>
                      <div className="flex items-center gap-5 text-xs font-medium text-slate-500 hidden sm:flex">
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">person</span> {pc.TenNguoiTao || '---'}</span>
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {formatDate(pc.NgayTao)}</span>
                      </div>
                    </div>

                    {expandedPC === pc.MaKHPC && (
                      <div className="p-6 bg-white animate-fade-in-up">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-sm">
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-400 block mb-1 font-medium">Người cập nhật</span> 
                            <span className="font-semibold text-slate-700">{pc.TenNguoiCapNhat || '---'}</span>
                          </div>
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-400 block mb-1 font-medium">Ngày cập nhật</span> 
                            <span className="font-semibold text-slate-700">{formatDate(pc.NgayCapNhat)}</span>
                          </div>
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-400 block mb-1 font-medium">Trạng thái NT</span> 
                            <span className="font-semibold text-slate-700">{pc.TrangThaiNghiemThu || '---'}</span>
                          </div>
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-400 block mb-1 font-medium">Người nghiệm thu</span> 
                            <span className="font-semibold text-slate-700">{pc.NguoiNghiemThu || '---'}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mb-6">
                          {pc.YKienNghiemThu && (
                            <div className="flex-1 min-w-[250px] bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm shadow-inner">
                              <span className="font-bold text-amber-800 block mb-1.5 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">rate_review</span> Ý kiến nghiệm thu:
                              </span> 
                              <span className="text-amber-900 leading-relaxed">{pc.YKienNghiemThu}</span>
                            </div>
                          )}
                          {pc.FilePDF && (
                            <div className="flex-shrink-0 flex items-center">
                              <a href={`/pdf/${pc.FilePDF}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 hover:shadow-sm text-slate-700 rounded-xl transition-all text-sm font-semibold border border-slate-200">
                                <span className="material-symbols-outlined text-[20px]">attachment</span> Xem File Phân Công
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="mt-2">
                          <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-emerald-600">checklist</span>
                            Chi tiết công việc
                          </h4>
                          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
                            <table className="w-full text-sm text-left">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                                  <th className="p-3.5 font-bold uppercase tracking-wider text-xs">Công việc cụ thể</th>
                                  <th className="p-3.5 font-bold uppercase tracking-wider text-xs">Thời gian</th>
                                  <th className="p-3.5 font-bold uppercase tracking-wider text-xs">Công nhân</th>
                                  <th className="p-3.5 font-bold uppercase tracking-wider text-xs text-center">Tiến độ</th>
                                  <th className="p-3.5 font-bold uppercase tracking-wider text-xs text-right">Khối lượng</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {pc.chiTietList?.map((ct) => (
                                  <tr key={ct.MaChiTiet} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="p-3.5 font-medium text-slate-800">{ct.CongViecCuThe}</td>
                                    <td className="p-3.5 text-slate-600">
                                      <div className="flex flex-col text-xs gap-1.5">
                                        <span className="flex items-center gap-1.5 bg-slate-100/50 px-2 py-0.5 rounded w-max"><span className="material-symbols-outlined text-[14px] text-slate-400">play_circle</span> {formatDate(ct.ThoiGianBatDau)}</span>
                                        <span className="flex items-center gap-1.5 bg-slate-100/50 px-2 py-0.5 rounded w-max"><span className="material-symbols-outlined text-[14px] text-slate-400">stop_circle</span> {formatDate(ct.ThoiGianKetThuc)}</span>
                                      </div>
                                    </td>
                                    <td className="p-3.5 text-slate-700 font-medium">{ct.HoTenCongNhan}</td>
                                    <td className="p-3.5 text-center">
                                      {ct.XacNhanLam ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-bold shadow-sm">
                                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Đã làm
                                        </span>
                                      ) : (
                                        <div className="flex flex-col items-center gap-1.5">
                                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-xs font-bold shadow-sm">
                                            <span className="material-symbols-outlined text-[14px]">pending</span> Chưa làm
                                          </span>
                                          {ct.LyDo && <span className="text-[11px] text-rose-500 truncate max-w-[140px] font-medium" title={ct.LyDo}>Lý do: {ct.LyDo}</span>}
                                        </div>
                                      )}
                                    </td>
                                    <td className="p-3.5 text-right font-mono font-bold text-slate-700 bg-slate-50/50">{ct.KhoiLuongHoanThanh}</td>
                                  </tr>
                                ))}
                                {(!pc.chiTietList || pc.chiTietList.length === 0) && (
                                  <tr>
                                    <td colSpan={5} className="p-6 text-center text-slate-500 italic">Không có công việc chi tiết.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Approval Action Section */}
          <div className="bg-white rounded-xl border shadow-sm sticky bottom-0 z-10" style={{ padding: '8px', borderColor: '#e2e8f0', marginTop: 'auto' }}>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 flex items-center gap-2" style={{ paddingBottom: '8px', marginBottom: '12px' }}>
              <span className="material-symbols-outlined text-rose-500">fact_check</span>
              Xử lý phê duyệt
            </h3>
            {isStatusDisabled ? (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 shadow-inner">
                <span className="material-symbols-outlined mt-0.5 text-amber-600 text-[24px]">warning</span>
                <div>
                  <p className="font-bold mb-1 text-sm">Kế hoạch đang ở trạng thái Đang thẩm định</p>
                  <p className="text-sm leading-relaxed">Hành động phê duyệt tạm thời bị vô hiệu hóa cho đến khi nhân viên kỹ thuật hoàn tất và gửi yêu cầu duyệt kế hoạch này.</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">edit_note</span> Ý kiến phê duyệt / Lý do từ chối:
                    </label>
                    <textarea
                      className="w-full py-4 px-5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all duration-300 resize-none text-slate-700 bg-white shadow-inner text-sm placeholder:text-slate-400"
                      rows={3}
                      style={{ padding: '16px 24px' }}
                      placeholder="Nhập nhận xét, ý kiến chỉ đạo hoặc chi tiết lý do từ chối..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">upload_file</span> Đính kèm File Pdf Bổ sung kế hoạch (Tùy chọn):
                    </label>
                    <div className="flex flex-col gap-2">
                      {!selectedFile ? (
                        <div className="relative group">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex items-center gap-3 w-full py-3 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-white group-hover:border-emerald-400 group-hover:bg-emerald-50/30 transition-all duration-300">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-500 transition-colors">
                              add_circle
                            </span>
                            <span className="text-sm text-slate-500 truncate font-medium group-hover:text-emerald-700 transition-colors">
                              Chọn file PDF bổ sung...
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3 w-full py-3 px-4 border-2 border-emerald-100 rounded-xl bg-emerald-50/30 animate-fade-in-up">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="material-symbols-outlined text-emerald-600">picture_as_pdf</span>
                            <span className="text-sm text-emerald-800 truncate font-bold">
                              {selectedFile.name}
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedFile(undefined);
                            }}
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all shadow-sm group"
                            title="Gỡ file đính kèm"
                          >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400 ml-1">Chỉ chấp nhận định dạng .pdf</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2" style={{ marginTop: '4px' }}>
                  <button
                    className="flex items-center justify-center rounded-xl font-bold transition-all shadow-sm text-sm"
                    style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '10px 24px', cursor: 'pointer' }}
                    onClick={() => {
                      if (!feedback.trim()) {
                        alert('Vui lòng nhập lý do từ chối vào ô "Ý kiến phê duyệt / Lý do từ chối".');
                        return;
                      }
                      onApprove('Bị từ chối', feedback, selectedFile, removeFiles);
                    }}
                  >
                    Từ chối
                  </button>
                  <button
                    className="flex items-center justify-center rounded-xl font-bold transition-all shadow-md text-sm"
                    style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '10px 24px', cursor: 'pointer' }}
                    onClick={() => onApprove('Đã phê duyệt', feedback, selectedFile, removeFiles)}
                  >
                    Phê duyệt
                  </button>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ApprovalDetailModal;
