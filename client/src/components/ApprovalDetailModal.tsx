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
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject' | 'cancel_approval' | null }>({ type: null });
  const [activeFileTab, setActiveFileTab] = useState<'all' | 'kehoach' | 'capphep' | 'bosung'>('all');

  useEffect(() => {
    if (isOpen && data) {
      // Kế hoạch đang chờ duyệt luôn hiển thị ô ý kiến trống để điền mới
      setFeedback(data.keHoach.TrangThai === 'Đang chờ duyệt' ? '' : (data.keHoach.YKienPheDuyet || ''));
      setSelectedFile(undefined); // Reset file selection for new action
      setRemoveFiles([]); // Reset removal list
      setActiveFileTab('all');
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  const { keHoach } = data;
  const statusInfo = PLAN_STATUS[keHoach.TrangThai as keyof typeof PLAN_STATUS] || { label: keHoach.TrangThai, color: 'bg-slate-100 text-slate-700' };

  // Logic: "đang chờ thẩm định" is disabled for manager approval
  const isStatusDisabled = keHoach.TrangThai === 'Đang thẩm định';
  const isAlreadyProcessed = keHoach.TrangThai === 'Đã phê duyệt' || keHoach.TrangThai === 'Bị từ chối';


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
    const existingBoSung = data?.keHoach.FilePDFBoSungKeHoach;
    if (existingBoSung && existingBoSung.trim() !== '') {
      alert('Kế hoạch bổ sung chỉ cho phép tối đa 1 file đính kèm. Vui lòng gỡ file hiện tại ở phần Tài liệu đính kèm trước khi đẩy lên file mới.');
      e.target.value = '';
      return;
    }

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

  const getFileColors = (key: string) => {
    switch (key) {
      case 'FilePDFKeHoach':
        return { bg: '#eff6ff', text: '#1e3a8a', border: '#bfdbfe', icon: 'description' };
      case 'FilePDFDeNghiCapPhep':
        return { bg: '#fffbeb', text: '#92400e', border: '#fde68a', icon: 'history_edu' };
      case 'FilePDFBoSungKeHoach':
        return { bg: '#eef2ff', text: '#3730a3', border: '#c7d2fe', icon: 'note_add' };
      default:
        return { bg: '#f8fafc', text: '#334155', border: '#e2e8f0', icon: 'picture_as_pdf' };
    }
  };

  const openPdf = (fileName?: string) => {
    if (fileName) {
      const baseUrl = window.location.origin;
      const filePath = `${baseUrl}/pdf/${fileName}`;
      console.log('Opening PDF:', filePath);
      window.open(filePath, '_blank', 'noopener,noreferrer');
    }
  };

  const renderFileLink = (file: { key: string, label: string, value: string, color?: string }, index?: number) => {
    const isRemoved = removeFiles.includes(file.value) || removeFiles.includes(file.key);
    const colors = getFileColors(file.key);
    
    return (
      <div key={`${file.key}-${index || 0}`} className={`relative flex items-center transition-all duration-300 ${isRemoved ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
        <button 
          onClick={() => openPdf(file.value)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all hover:shadow-md cursor-pointer text-sm font-bold"
          style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, outline: 'none' }}
        >
          <span className="material-symbols-outlined text-[20px]">{colors.icon}</span> 
          {file.label} {index !== undefined ? `#${index + 1}` : ''}
        </button>
        {!isStatusDisabled && !isAlreadyProcessed && !isRemoved && (
          <button 
            onClick={() => handleRemoveFile(file.key, file.label, file.key === 'FilePDFBoSungKeHoach' ? file.value : undefined)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-sm z-10 cursor-pointer"
            style={{ backgroundColor: '#ef4444', border: '2px solid #ffffff' }}
            title="Gỡ file này"
          >
            <span className="material-symbols-outlined text-[14px] font-bold">close</span>
          </button>
        )}
        {isRemoved && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>
            <span className="bg-slate-800 text-white text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider shadow-sm">Đã gỡ</span>
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
          <div className="flex-1 pr-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                Chi tiết kế hoạch
              </h2>
              <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-[12px] font-bold border ${keHoach.TrangThai === 'Bị từ chối' ? 'bg-rose-50 text-rose-600 border-rose-200' : keHoach.TrangThai === 'Đã phê duyệt' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : keHoach.TrangThai === 'Đang thẩm định' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                {statusInfo.label}
              </span>
            </div>
            <p className="text-slate-500 font-medium mt-1.5 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">article</span>
              {keHoach.TieuDe}
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <span className="font-mono font-black text-slate-600 text-[20px] tracking-widest">
              #{keHoach.MaKeHoach}
            </span>
            <button 
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all p-2 rounded-full"
              onClick={onClose}
              title="Đóng"
            >
              <span className="material-symbols-outlined block text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Body with custom scrollbar */}
        <div className="overflow-y-auto bg-slate-50/50 flex-1 custom-scrollbar" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Main Info Section */}
          <div className="bg-white rounded-xl border shadow-sm" style={{ padding: '24px', borderColor: '#e2e8f0' }}>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 flex items-center gap-2" style={{ paddingBottom: '12px', marginBottom: '24px' }}>
              <span className="material-symbols-outlined text-emerald-500">info</span>
              Thông tin chung
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Cột 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Người lập</span>
                    <div className="font-medium text-slate-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
                      {keHoach.TenNguoiLap || keHoach.NguoiLap}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ngày tạo</span>
                    <div className="font-medium text-slate-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">calendar_today</span>
                      {formatDate(keHoach.NgayTao)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tuyến đường</span>
                    <div className="font-medium text-slate-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">route</span>
                      {keHoach.TenTuyenDuong}
                    </div>
                  </div>
                </div>

                {/* Cột 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Người xử lý</span>
                    <div className="font-medium text-slate-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">manage_accounts</span>
                      {keHoach.TenNguoiXuLy || keHoach.NguoiXuLy || '---'}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ngày cập nhật</span>
                    <div className="font-medium text-slate-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">update</span>
                      {formatDate(keHoach.NgayCapNhat)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Xã phường</span>
                    <div className="font-medium text-slate-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">location_city</span>
                      {keHoach.TenXaPhuong}
                    </div>
                  </div>
                </div>
              </div>
            
            <div className="border-t border-slate-100" style={{ marginTop: '24px', paddingTop: '16px' }}>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 gap-4" style={{ paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 m-0">
                <span className="material-symbols-outlined text-blue-500">folder_open</span>
                Tài liệu đính kèm
              </h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setActiveFileTab('all')}
                  className="text-xs font-bold rounded-lg transition-all cursor-pointer hover:bg-slate-50"
                  style={{
                    backgroundColor: activeFileTab === 'all' ? '#1e293b' : 'transparent',
                    color: activeFileTab === 'all' ? '#ffffff' : '#64748b',
                    border: 'none',
                    padding: '6px 12px'
                  }}
                >
                  Tất cả
                </button>
                <button 
                  onClick={() => setActiveFileTab('kehoach')}
                  className="text-xs font-bold rounded-lg transition-all cursor-pointer hover:bg-blue-50"
                  style={{
                    backgroundColor: activeFileTab === 'kehoach' ? '#2563eb' : 'transparent',
                    color: activeFileTab === 'kehoach' ? '#ffffff' : '#3b82f6',
                    border: 'none',
                    padding: '6px 12px'
                  }}
                >
                  Kế hoạch
                </button>
                <button 
                  onClick={() => setActiveFileTab('capphep')}
                  className="text-xs font-bold rounded-lg transition-all cursor-pointer hover:bg-amber-50"
                  style={{
                    backgroundColor: activeFileTab === 'capphep' ? '#f59e0b' : 'transparent',
                    color: activeFileTab === 'capphep' ? '#ffffff' : '#f59e0b',
                    border: 'none',
                    padding: '6px 12px'
                  }}
                >
                  Cấp phép
                </button>
                <button 
                  onClick={() => setActiveFileTab('bosung')}
                  className="text-xs font-bold rounded-lg transition-all cursor-pointer hover:bg-indigo-50"
                  style={{
                    backgroundColor: activeFileTab === 'bosung' ? '#4f46e5' : 'transparent',
                    color: activeFileTab === 'bosung' ? '#ffffff' : '#4f46e5',
                    border: 'none',
                    padding: '6px 12px'
                  }}
                >
                  Bổ sung
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {activeFileTab === 'all' && (
                <>
                  {[
                    { key: 'FilePDFKeHoach', label: 'Kế hoạch gốc', value: keHoach.FilePDFKeHoach, color: 'blue' },
                    { key: 'FilePDFDeNghiCapPhep', label: 'Đề nghị cấp phép', value: keHoach.FilePDFDeNghiCapPhep, color: 'amber' },
                  ].map(file => file.value && renderFileLink(file as any))}

                  {keHoach.FilePDFBoSungKeHoach && keHoach.FilePDFBoSungKeHoach.split(',').map((fileName, idx) => (
                    renderFileLink({ key: 'FilePDFBoSungKeHoach', label: 'Kế hoạch bổ sung', value: fileName, color: 'indigo' }, idx)
                  ))}

                  {(!keHoach.FilePDFKeHoach && !keHoach.FilePDFDeNghiCapPhep && !keHoach.FilePDFBoSungKeHoach) && (
                    <span className="text-sm text-slate-500 italic bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">Không có tài liệu đính kèm.</span>
                  )}
                </>
              )}

              {activeFileTab === 'kehoach' && (
                <>
                  {keHoach.FilePDFKeHoach ? (
                    renderFileLink({ key: 'FilePDFKeHoach', label: 'Kế hoạch gốc', value: keHoach.FilePDFKeHoach, color: 'blue' })
                  ) : (
                    <span className="text-sm text-slate-500 italic bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">Không có tài liệu Kế hoạch.</span>
                  )}
                </>
              )}

              {activeFileTab === 'capphep' && (
                <>
                  {keHoach.FilePDFDeNghiCapPhep ? (
                    renderFileLink({ key: 'FilePDFDeNghiCapPhep', label: 'Đề nghị cấp phép', value: keHoach.FilePDFDeNghiCapPhep, color: 'amber' })
                  ) : (
                    <span className="text-sm text-slate-500 italic bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">Không có tài liệu Cấp phép.</span>
                  )}
                </>
              )}

              {activeFileTab === 'bosung' && (
                <>
                  {keHoach.FilePDFBoSungKeHoach ? (
                    keHoach.FilePDFBoSungKeHoach.split(',').map((fileName, idx) => (
                      renderFileLink({ key: 'FilePDFBoSungKeHoach', label: 'Kế hoạch bổ sung', value: fileName, color: 'indigo' }, idx)
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 italic bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">Không có tài liệu Bổ sung.</span>
                  )}
                </>
              )}
            </div>
          </div>


          {/* Approval Action Section */}
          <div 
            className={isAlreadyProcessed 
              ? "sticky bottom-0 z-10 flex justify-end" 
              : "bg-white rounded-xl border shadow-sm sticky bottom-0 z-10"
            } 
            style={isAlreadyProcessed 
              ? { marginTop: 'auto', paddingTop: '16px' } 
              : { padding: '8px', borderColor: '#e2e8f0', marginTop: 'auto' }
            }
          >
            {isAlreadyProcessed ? (
              <button
                className="flex items-center justify-center rounded-xl font-bold transition-all shadow-sm text-sm hover:opacity-90"
                style={{ backgroundColor: '#f59e0b', color: '#ffffff', border: 'none', padding: '10px 24px', cursor: 'pointer' }}
                onClick={() => setConfirmAction({ type: 'cancel_approval' })}
              >
                <span className="material-symbols-outlined text-[18px] mr-2">undo</span>
                Hủy phê duyệt
              </button>
            ) : (
              <>
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
                        className="flex items-center justify-center rounded-xl font-bold transition-all shadow-sm text-sm hover:opacity-90"
                        style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '10px 24px', cursor: 'pointer' }}
                        onClick={() => {
                          if (!feedback.trim()) {
                            alert('Vui lòng nhập lý do từ chối vào ô "Ý kiến phê duyệt / Lý do từ chối".');
                            return;
                          }
                          setConfirmAction({ type: 'reject' });
                        }}
                      >
                        Từ chối
                      </button>
                      <button
                        className="flex items-center justify-center rounded-xl font-bold transition-all shadow-md text-sm hover:opacity-90"
                        style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '10px 24px', cursor: 'pointer' }}
                        onClick={() => setConfirmAction({ type: 'approve' })}
                      >
                        Phê duyệt
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction.type && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden transform transition-all m-4 border border-slate-100 animate-fade-in-up">
            <div className="p-6" style={{ padding: '24px' }}>
              <div className="flex items-center gap-4 mb-5" style={{ marginBottom: '20px' }}>
                <div className="flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0" 
                     style={{ backgroundColor: confirmAction.type === 'approve' ? '#d1fae5' : confirmAction.type === 'reject' ? '#ffe4e6' : '#fef3c7' }}>
                  <span className="material-symbols-outlined text-[28px]" 
                        style={{ color: confirmAction.type === 'approve' ? '#059669' : confirmAction.type === 'reject' ? '#e11d48' : '#d97706' }}>
                    {confirmAction.type === 'approve' ? 'check_circle' : confirmAction.type === 'reject' ? 'warning' : 'undo'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 m-0 leading-tight">
                  {confirmAction.type === 'approve' ? 'Xác nhận phê duyệt' : confirmAction.type === 'reject' ? 'Xác nhận từ chối' : 'Hủy phê duyệt'}
                </h3>
              </div>
              <p className="text-slate-600 text-sm mb-6" style={{ marginBottom: '24px' }}>
                {confirmAction.type === 'cancel_approval' ? (
                  <span>Bạn có chắc chắn muốn <strong>hủy kết quả</strong> của kế hoạch này không? Trạng thái sẽ được chuyển về "Đang chờ duyệt".</span>
                ) : (
                  <span>Bạn có chắc chắn muốn <span className="font-bold">{confirmAction.type === 'approve' ? 'phê duyệt' : 'từ chối'}</span> kế hoạch này không? Hành động này sẽ gửi kết quả cho người lập kế hoạch.</span>
                )}
              </p>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100" style={{ paddingTop: '16px', marginTop: '16px' }}>
                <button
                  className="rounded-xl font-semibold text-sm transition-all cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '8px 20px' }}
                  onClick={() => setConfirmAction({ type: null })}
                >
                  Hủy
                </button>
                <button
                  className="rounded-xl text-white font-semibold text-sm transition-all shadow-sm cursor-pointer hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: confirmAction.type === 'approve' ? '#059669' : confirmAction.type === 'reject' ? '#e11d48' : '#d97706',
                    border: 'none',
                    padding: '8px 20px'
                  }}
                  onClick={() => {
                    const newStatus = confirmAction.type === 'approve' ? 'Đã phê duyệt' 
                                    : confirmAction.type === 'reject' ? 'Bị từ chối' 
                                    : 'Đang chờ duyệt';
                    onApprove(
                      newStatus,
                      newStatus === 'Đang chờ duyệt' ? '' : feedback,
                      selectedFile,
                      removeFiles
                    );
                    if (newStatus === 'Đang chờ duyệt') {
                      setFeedback('');
                    }
                    setConfirmAction({ type: null });
                  }}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalDetailModal;
