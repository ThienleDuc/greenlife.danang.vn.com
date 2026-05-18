import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { KeHoachChiTietResponse } from '../types';
import { PLAN_STATUS } from '../constants/constants';
import { PheDuyetService } from '../services/pheDuyetService';

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

const PheDuyetKeHoachDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<KeHoachChiTietResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [removeFiles, setRemoveFiles] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject' | 'cancel_approval' | null }>({ type: null });
  const [activeFileTab, setActiveFileTab] = useState<'all' | 'kehoach' | 'capphep' | 'bosung'>('all');

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const detail = await PheDuyetService.getKeHoachChiTiet(id);
      if (detail) {
        setData(detail);
        setFeedback(detail.keHoach.TrangThai === 'Đang chờ duyệt' ? '' : (detail.keHoach.YKienPheDuyet || ''));
        setSelectedFile(undefined);
        setRemoveFiles([]);
        setActiveFileTab('all');
      } else {
        alert('Không tìm thấy thông tin kế hoạch.');
        navigate('/phe-duyet-ke-hoach');
      }
    } catch (error) {
      console.error('Error fetching detail:', error);
      alert('Có lỗi xảy ra khi tải chi tiết kế hoạch.');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-slate-500 font-medium">Đang tải thông tin chi tiết kế hoạch...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <span className="material-symbols-outlined text-[48px] text-slate-300 mb-4">error</span>
        <p className="text-slate-500 font-medium">Không tìm thấy thông tin kế hoạch.</p>
        <button
          onClick={() => navigate('/phe-duyet-ke-hoach')}
          className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const { keHoach } = data;
  const statusInfo = PLAN_STATUS[keHoach.TrangThai as keyof typeof PLAN_STATUS] || { label: keHoach.TrangThai, color: 'bg-slate-100 text-slate-700' };

  const isStatusDisabled = keHoach.TrangThai === 'Đang thẩm định';
  const isAlreadyProcessed = keHoach.TrangThai === 'Đã phê duyệt' || keHoach.TrangThai === 'Bị từ chối';

  const handleRemoveFile = async (fileKey: string, fileLabel: string, specificFilename?: string) => {
    const displayName = specificFilename ? `${fileLabel} (${specificFilename})` : fileLabel;
    if (!window.confirm(`Bạn có chắc chắn muốn gỡ bỏ "${displayName}" ngay lập tức không? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      await PheDuyetService.removeSpecificFile(keHoach.MaKeHoach, fileKey, specificFilename);

      if (data && data.keHoach) {
        if (specificFilename) {
          const currentFiles = (data.keHoach as any)[fileKey]?.split(',') || [];
          const updatedFiles = currentFiles.filter((f: string) => f !== specificFilename);
          (data.keHoach as any)[fileKey] = updatedFiles.length > 0 ? updatedFiles.join(',') : null;
        } else {
          (data.keHoach as any)[fileKey] = null;
        }
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

  const openLocalPdf = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank', 'noopener,noreferrer');
  };

  const handleApprove = async (status: string, feedbackVal: string, file?: File, removeFilesList?: string[]) => {
    try {
      await PheDuyetService.updateTrangThaiPheDuyet(
        keHoach.MaKeHoach,
        status,
        feedbackVal,
        'aB3kL9pQx2mV8nZ1cY5t', // Mock User ID
        file,
        removeFilesList
      );
      fetchDetail();
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật trạng thái.');
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
    <div className="approval-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

      {/* Navigation Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/theo-doi-ke-hoach')}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all font-bold text-sm shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Theo dõi kế hoạch
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col">

        {/* Header Block */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/80 rounded-t-2xl" style={{ padding: '24px 36px' }}>
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
          <div className="flex items-center shrink-0">
            <span className="font-mono font-black text-slate-600 text-[20px] tracking-widest">
              #{keHoach.MaKeHoach}
            </span>
          </div>
        </div>

        {/* Details Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ padding: '36px' }}>

          {/* Left Column - Main Details (2/3 width on desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* General Information Card */}
            <div className="bg-white rounded-xl border" style={{ padding: '28px', borderColor: '#f1f5f9' }}>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 flex items-center gap-2" style={{ paddingBottom: '14px', marginBottom: '28px' }}>
                <span className="material-symbols-outlined text-emerald-500">info</span>
                Thông tin chung
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                {/* Left Column */}
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

                {/* Right Column */}
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

              <div className="border-t border-slate-100" style={{ marginTop: '32px', paddingTop: '20px' }}>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">description</span> Mô tả chi tiết
                </span>
                <div className="bg-slate-50/80 rounded-xl border border-slate-100 shadow-inner" style={{ padding: '20px 28px' }}>
                  <p className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">
                    {keHoach.MoTa || <span className="italic text-slate-400">Không có mô tả</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Attached Files Card */}
            <div className="bg-white rounded-xl border" style={{ padding: '28px', borderColor: '#f1f5f9' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 gap-4" style={{ paddingBottom: '16px', marginBottom: '24px' }}>
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

          </div>

          {/* Right Column - Sidebar (1/3 width on desktop) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-[170px] flex flex-col gap-6">

              {/* Action Approval Card */}
              <div className="bg-white rounded-xl border" style={{ padding: '36px 24px', borderColor: '#f1f5f9' }}>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 flex items-center gap-2" style={{ paddingBottom: '16px', marginBottom: '28px' }}>
                  <span className="material-symbols-outlined text-rose-500">fact_check</span>
                  Xử lý phê duyệt
                </h3>
                {isAlreadyProcessed ? (
                  <div className="flex flex-col gap-5 bg-slate-50 rounded-xl border border-slate-100" style={{ padding: '28px 20px' }}>
                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-[32px] text-emerald-600 mt-0.5">check_circle</span>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Kế hoạch đã xử lý</h4>
                        <p className="text-xs text-slate-500 mt-1.5">Trạng thái hiện tại: <span className="font-bold">{statusInfo.label}</span></p>
                      </div>
                    </div>
                    <button
                      className="w-full flex items-center justify-center rounded-xl font-bold transition-all shadow-sm text-sm hover:opacity-90 py-3"
                      style={{ backgroundColor: '#f59e0b', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                      onClick={() => setConfirmAction({ type: 'cancel_approval' })}
                    >
                      <span className="material-symbols-outlined text-[18px] mr-2">undo</span>
                      Hủy phê duyệt
                    </button>
                  </div>
                ) : (
                  isStatusDisabled ? (
                    <div className="flex items-start gap-4 p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 shadow-inner">
                      <span className="material-symbols-outlined mt-0.5 text-amber-600 text-[26px]">warning</span>
                      <div>
                        <p className="font-bold mb-2 text-sm">Kế hoạch đang ở trạng thái Đang thẩm định</p>
                        <p className="text-xs leading-relaxed mt-1.5">Hành động phê duyệt tạm thời bị vô hiệu hóa cho đến khi nhân viên kỹ thuật hoàn tất và gửi yêu cầu duyệt kế hoạch này.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-6" style={{ padding: '28px 20px' }}>
                      <div className="relative">
                        <label className="block text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[20px] text-slate-500">edit_note</span> Ý kiến phê duyệt / Lý do từ chối:
                        </label>
                        <textarea
                          className="w-full border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all duration-300 resize-none text-slate-800 bg-white shadow-inner text-[15px] placeholder:text-slate-400"
                          style={{ padding: '20px 24px' }}
                          rows={4}
                          placeholder="Nhập nhận xét, ý kiến chỉ đạo hoặc chi tiết lý do từ chối..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[20px] text-slate-500">upload_file</span> Đính kèm File Pdf Bổ sung:
                        </label>
                        <div className="flex flex-col gap-2.5">
                          {!selectedFile ? (
                            <div className="relative group">
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <div className="flex items-center justify-center gap-3 w-full py-4 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-white group-hover:border-emerald-400 group-hover:bg-emerald-50/30 transition-all duration-300">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-500 text-[22px] transition-colors">
                                  add_circle
                                </span>
                                <span className="text-sm text-slate-600 truncate font-bold group-hover:text-emerald-700 transition-colors">
                                  Chọn file PDF bổ sung...
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-3.5 w-full py-3 px-3.5 border-2 border-emerald-100 rounded-xl bg-emerald-50/30 animate-fade-in-up">
                              <div
                                onClick={() => openLocalPdf(selectedFile)}
                                className="flex items-center gap-2.5 overflow-hidden cursor-pointer hover:underline group/file"
                                title="Click để xem trước file PDF"
                              >
                                <span className="material-symbols-outlined text-emerald-600 group-hover/file:text-emerald-700 text-[20px] transition-colors">picture_as_pdf</span>
                                <span className="text-sm text-emerald-800 truncate font-bold group-hover/file:text-emerald-950 transition-colors">
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
                          <p className="text-xs text-slate-500 ml-1">Chỉ chấp nhận định dạng .pdf</p>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <button
                          className="flex-1 flex items-center justify-center rounded-xl font-extrabold transition-all shadow-sm text-[15px] hover:opacity-90 py-4"
                          style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', cursor: 'pointer' }}
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
                          className="flex-1 flex items-center justify-center rounded-xl font-extrabold transition-all shadow-md text-[15px] hover:opacity-90 py-4"
                          style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                          onClick={() => setConfirmAction({ type: 'approve' })}
                        >
                          Phê duyệt
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

            </div>
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
              {confirmAction.type === 'approve' && !selectedFile && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs mb-5 shadow-sm animate-pulse" style={{ marginBottom: '20px' }}>
                  <span className="material-symbols-outlined text-[18px] text-amber-600 flex-shrink-0 mt-0.5">warning</span>
                  <span className="font-semibold leading-relaxed">Cảnh báo: Bạn chưa đính kèm file PDF bổ sung</span>
                </div>
              )}
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
                    handleApprove(
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

export default PheDuyetKeHoachDetail;
