import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GuiKeHoachService } from '../../services/guiKeHoachService';
import { LocationService } from '../../services/locationService';
import type { DanhMucCongViec, KeHoachCongViec, TuyenDuong, XaPhuong } from '../../types';
import { PATHS } from '../../utils/pathUtils';
import { storage } from '../../utils/storageUtils';
import TreeAlert from '../../components/TreeAlert';

type PlanFormState = {
  maLoaiCongViec: string;
  maXaPhuong: string;
  maTuyenDuong: string;
  tieuDe: string;
  moTa: string;
};

type PlanFileState = {
  fileKeHoach: File | null;
  fileDeNghiCapPhep: File | null;
};

type NoticeState = {
  type: 'success' | 'error';
  text: string;
} | null;

type ApiError = {
  response?: { data?: { message?: string } };
  message?: string;
};

const EMPTY_FORM: PlanFormState = {
  maLoaiCongViec: '',
  maXaPhuong: '',
  maTuyenDuong: '',
  tieuDe: '',
  moTa: '',
};

const EMPTY_FILES: PlanFileState = {
  fileKeHoach: null,
  fileDeNghiCapPhep: null,
};

const MAX_PDF_SIZE = 10 * 1024 * 1024;

const getApiErrorMessage = (error: ApiError | unknown, fallback: string) => {
  const e = error as ApiError;
  return e?.response?.data?.message || e?.message || fallback;
};

const openPdf = (fileName?: string) => {
  if (!fileName) return;
  window.open(`/pdf/${encodeURIComponent(fileName)}`, '_blank', 'noopener,noreferrer');
};

const ChinhSuaHuyKeHoach: React.FC = () => {
  const { maKeHoach = '' } = useParams<{ maKeHoach: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<PlanFormState>(EMPTY_FORM);
  const [files, setFiles] = useState<PlanFileState>(EMPTY_FILES);
  const [plan, setPlan] = useState<KeHoachCongViec | null>(null);
  const [jobTypes, setJobTypes] = useState<DanhMucCongViec[]>([]);
  const [xaPhuongList, setXaPhuongList] = useState<XaPhuong[]>([]);
  const [tuyenDuongList, setTuyenDuongList] = useState<TuyenDuong[]>([]);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fileKeHoachRef = useRef<HTMLInputElement>(null);
  const fileDeNghiRef = useRef<HTMLInputElement>(null);

  const openLocalPdf = (file: File | null) => {
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const resetFileInputs = () => {
    if (fileKeHoachRef.current) fileKeHoachRef.current.value = '';
    if (fileDeNghiRef.current) fileDeNghiRef.current.value = '';
  };

  const applyPlanToForm = (data: KeHoachCongViec) => {
    setPlan(data);
    setForm({
      maLoaiCongViec: data.MaLoaiCongViec || '',
      maXaPhuong: data.MaXaPhuong || '',
      maTuyenDuong: data.MaTuyenDuong || '',
      tieuDe: data.TieuDe || '',
      moTa: data.MoTa || '',
    });
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (!maKeHoach) {
        setNotice({ type: 'error', text: 'Thiếu mã kế hoạch trên đường dẫn' });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [jobTypeData, xaPhuongData, planData] = await Promise.all([
          GuiKeHoachService.getDanhMucCongViec(),
          LocationService.getXaPhuongList(),
          GuiKeHoachService.getKeHoachByMa(maKeHoach),
        ]);

        setJobTypes(jobTypeData);
        setXaPhuongList(xaPhuongData);
        applyPlanToForm(planData);
      } catch (error) {
        setNotice({
          type: 'error',
          text: getApiErrorMessage(error, 'Không thể tải chi tiết kế hoạch'),
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [maKeHoach]);

  useEffect(() => {
    let isActive = true;

    const loadTuyenDuong = async () => {
      if (!form.maXaPhuong) {
        setTuyenDuongList([]);
        return;
      }

      try {
        setRouteLoading(true);
        const data = await LocationService.getTuyenDuongList(form.maXaPhuong);
        if (isActive) {
          setTuyenDuongList(data);
        }
      } catch (error) {
        if (isActive) {
          setNotice({
            type: 'error',
            text: getApiErrorMessage(error, 'Không thể tải danh sách tuyến đường'),
          });
        }
      } finally {
        if (isActive) {
          setRouteLoading(false);
        }
      }
    };

    loadTuyenDuong();

    return () => {
      isActive = false;
    };
  }, [form.maXaPhuong]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleXaPhuongChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      maXaPhuong: event.target.value,
      maTuyenDuong: '',
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = event.target;
    const selectedFile = selectedFiles?.[0] || null;

    if (selectedFile) {
      const isPdf = selectedFile.type === 'application/pdf' && selectedFile.name.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        setNotice({ type: 'error', text: 'Chỉ cho phép tải lên file PDF' });
        event.target.value = '';
        return;
      }

      if (selectedFile.size > MAX_PDF_SIZE) {
        setNotice({ type: 'error', text: 'Dung lượng file vượt quá giới hạn 10MB' });
        event.target.value = '';
        return;
      }
    }

    setFiles((prev) => ({
      ...prev,
      [name]: selectedFile,
    }));
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append('maLoaiCongViec', form.maLoaiCongViec);
    formData.append('tieuDe', form.tieuDe.trim());
    formData.append('moTa', form.moTa.trim());
    formData.append('maTuyenDuong', form.maTuyenDuong);

    const currentUser = storage.getUser();
    if (currentUser?.maNguoiDung) {
      formData.append('nguoiXuLy', currentUser.maNguoiDung);
    }

    if (files.fileKeHoach) formData.append('fileKeHoach', files.fileKeHoach);
    if (files.fileDeNghiCapPhep) formData.append('fileDeNghiCapPhep', files.fileDeNghiCapPhep);

    return formData;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setNotice(null);

      const updatedPlan = await GuiKeHoachService.updateKeHoach(maKeHoach, buildFormData());
      applyPlanToForm(updatedPlan);
      setFiles(EMPTY_FILES);
      resetFileInputs();
      
      setNotice({ type: 'success', text: 'Cập nhật kế hoạch thành công.' });
    } catch (error) {
      setNotice({
        type: 'error',
        text: getApiErrorMessage(error, 'Không thể cập nhật kế hoạch, vui lòng thử lại'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelPlan = () => {
    setConfirmCancel(true);
  };

  const executeCancelPlan = async () => {
    setConfirmCancel(false);
    try {
      setCancelling(true);
      setNotice(null);

      await GuiKeHoachService.huyKeHoach(maKeHoach);
      setNotice({ type: 'success', text: 'Hủy kế hoạch thành công.' });
    } catch (error) {
      setNotice({
        type: 'error',
        text: getApiErrorMessage(error, 'Không thể hủy kế hoạch, vui lòng thử lại'),
      });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="send-plan-page">
      <div className="send-plan-header">
        <div>
          <h1>Chỉnh sửa/Hủy kế hoạch</h1>
          <p>Mã kế hoạch: {maKeHoach || '---'}</p>
        </div>
        <button
          type="button"
          className="send-plan-secondary-btn"
          onClick={() => navigate(PATHS.KY_THUAT.DASHBOARD)}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Theo dõi kế hoạch
        </button>
      </div>

      <TreeAlert 
        isOpen={!!notice || confirmCancel}
        type={confirmCancel ? 'question' : (notice?.type || 'info')}
        message={confirmCancel ? `Hủy kế hoạch ${maKeHoach}?` : (notice?.text || '')}
        title={confirmCancel ? 'Xác nhận hủy' : (notice?.type === 'success' ? 'Nhấn OK để chuyển hướng' : 'Lỗi')}
        onClose={() => { 
          if (notice?.type === 'success') {
            navigate(PATHS.KY_THUAT.DASHBOARD);
          } else {
            setNotice(null); 
            setConfirmCancel(false); 
          }
        }}
        onOk={() => {
          if (confirmCancel) {
            executeCancelPlan();
          } else if (notice?.type === 'success') {
            navigate(PATHS.KY_THUAT.DASHBOARD);
          } else {
            setNotice(null);
          }
        }}
        onCancel={confirmCancel ? () => setConfirmCancel(false) : undefined}
      />

      {loading ? (
        <div className="send-plan-empty">
          <span className="material-symbols-outlined">progress_activity</span>
          <p>Đang tải chi tiết kế hoạch...</p>
        </div>
      ) : (
        <form className="send-plan-form" onSubmit={handleSubmit}>
          <div className="send-plan-form-title">
            <span className="material-symbols-outlined">edit_document</span>
            <h2>Thông tin kế hoạch hiện tại</h2>
          </div>

          <div className="send-plan-grid">
            <label className="send-plan-field">
              <span>Loại kế hoạch</span>
              <select
                name="maLoaiCongViec"
                value={form.maLoaiCongViec}
                onChange={handleInputChange}
              >
                <option value="">Chọn loại kế hoạch</option>
                {jobTypes.map((item) => (
                  <option key={item.MaLoaiCongViec} value={item.MaLoaiCongViec}>
                    {item.TenCongViec || item.MaLoaiCongViec}
                  </option>
                ))}
              </select>
            </label>

            <label className="send-plan-field">
              <span>Xã/phường</span>
              <select
                name="maXaPhuong"
                value={form.maXaPhuong}
                onChange={handleXaPhuongChange}
              >
                <option value="">Chọn xã/phường</option>
                {xaPhuongList.map((item) => (
                  <option key={item.MaXaPhuong} value={item.MaXaPhuong}>
                    {item.TenXaPhuong || item.MaXaPhuong}
                  </option>
                ))}
              </select>
            </label>

            <label className="send-plan-field">
              <span>Tuyến đường</span>
              <select
                name="maTuyenDuong"
                value={form.maTuyenDuong}
                onChange={handleInputChange}
                disabled={!form.maXaPhuong || routeLoading}
              >
                <option value="">
                  {form.maXaPhuong
                    ? (routeLoading ? 'Đang tải tuyến đường...' : 'Chọn tuyến đường')
                    : 'Chọn xã/phường trước'}
                </option>
                {tuyenDuongList.map((item) => (
                  <option key={item.MaTuyenDuong} value={item.MaTuyenDuong}>
                    {item.TenTuyenDuong || item.MaTuyenDuong}
                  </option>
                ))}
              </select>
            </label>

            <label className="send-plan-field wide">
              <span>Tiêu đề kế hoạch</span>
              <input
                name="tieuDe"
                value={form.tieuDe}
                onChange={handleInputChange}
                maxLength={200}
              />
            </label>

            <label className="send-plan-field wide">
              <span>Mô tả ngắn</span>
              <textarea
                name="moTa"
                value={form.moTa}
                onChange={handleInputChange}
                maxLength={500}
                rows={4}
              />
            </label>

            <div className="send-plan-field">
              <span>File PDF kế hoạch</span>
              <div className="custom-file-upload">
                <input
                  ref={fileKeHoachRef}
                  name="fileKeHoach"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                />
                <span className="material-symbols-outlined">upload_file</span>
                <span className="upload-text">Chọn hoặc kéo thả file PDF</span>
              </div>
              {files.fileKeHoach && (
                <div className="send-plan-file-preview">
                  <button
                    type="button"
                    className="preview-pdf-btn"
                    onClick={() => openLocalPdf(files.fileKeHoach)}
                    title="Click để xem trước file PDF"
                  >
                    <span className="material-symbols-outlined">visibility</span>
                    <span>Xem trước: {files.fileKeHoach.name}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="send-plan-field">
              <span>File PDF đề nghị cấp phép</span>
              <div className="custom-file-upload">
                <input
                  ref={fileDeNghiRef}
                  name="fileDeNghiCapPhep"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                />
                <span className="material-symbols-outlined">upload_file</span>
                <span className="upload-text">Chọn hoặc kéo thả file PDF</span>
              </div>
              {files.fileDeNghiCapPhep && (
                <div className="send-plan-file-preview">
                  <button
                    type="button"
                    className="preview-pdf-btn"
                    onClick={() => openLocalPdf(files.fileDeNghiCapPhep)}
                    title="Click để xem trước file PDF"
                  >
                    <span className="material-symbols-outlined">visibility</span>
                    <span>Xem trước: {files.fileDeNghiCapPhep.name}</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {plan && (
            <div className="send-plan-current-files">
              {plan.FilePDFKeHoach && (
                <button type="button" onClick={() => openPdf(plan.FilePDFKeHoach)}>
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                  Kế hoạch hiện tại
                </button>
              )}
              {plan.FilePDFDeNghiCapPhep && (
                <button type="button" onClick={() => openPdf(plan.FilePDFDeNghiCapPhep)}>
                  <span className="material-symbols-outlined">history_edu</span>
                  Cấp phép hiện tại
                </button>
              )}
            </div>
          )}

          <div className="send-plan-actions send-plan-actions-inline">
            {(plan?.TrangThai === 'Đã gửi' || plan?.TrangThai === 'Bị từ chối') && (
              <button
                type="submit"
                className="send-plan-primary-btn"
                disabled={submitting || cancelling}
              >
                <span className="material-symbols-outlined">sync</span>
                Cập nhật kế hoạch
              </button>
            )}
            {plan?.TrangThai !== 'Đã hủy' && plan?.TrangThai !== 'Đang thẩm định' && plan?.TrangThai !== 'Đã phê duyệt' && (
              <button
                type="button"
                className="send-plan-danger-btn"
                onClick={handleCancelPlan}
                disabled={submitting || cancelling}
              >
                <span className="material-symbols-outlined">cancel</span>
                Hủy kế hoạch
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ChinhSuaHuyKeHoach;