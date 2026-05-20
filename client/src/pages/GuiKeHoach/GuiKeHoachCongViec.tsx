import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GuiKeHoachService } from '../../services/guiKeHoachService';
import { LocationService } from '../../services/locationService';
import type { DanhMucCongViec, TuyenDuong, XaPhuong } from '../../types';

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

const ALLOWED_PLAN_TYPE_CODES = ['TM', 'CS', 'DIDOI', 'CHATHA'];
const PERMIT_REQUIRED_TYPE_CODES = ['DIDOI', 'CHATHA'];
const MAX_PDF_SIZE = 10 * 1024 * 1024;

const getApiErrorMessage = (error: ApiError | unknown, fallback: string) => {
  const e = error as ApiError;
  return e?.response?.data?.message || e?.message || fallback;
};

const GuiKeHoachCongViec: React.FC = () => {
  const [form, setForm] = useState<PlanFormState>(EMPTY_FORM);
  const [files, setFiles] = useState<PlanFileState>(EMPTY_FILES);
  const [jobTypes, setJobTypes] = useState<DanhMucCongViec[]>([]);
  const [xaPhuongList, setXaPhuongList] = useState<XaPhuong[]>([]);
  const [tuyenDuongList, setTuyenDuongList] = useState<TuyenDuong[]>([]);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileKeHoachRef = useRef<HTMLInputElement>(null);
  const fileDeNghiRef = useRef<HTMLInputElement>(null);

  const requiresPermitFile = PERMIT_REQUIRED_TYPE_CODES.includes(form.maLoaiCongViec);

  const openLocalPdf = (file: File | null) => {
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const filteredJobTypes = useMemo(() => {
    return jobTypes.filter((item) => ALLOWED_PLAN_TYPE_CODES.includes(item.MaLoaiCongViec));
  }, [jobTypes]);

  const resetFileInputs = () => {
    if (fileKeHoachRef.current) fileKeHoachRef.current.value = '';
    if (fileDeNghiRef.current) fileDeNghiRef.current.value = '';
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFiles(EMPTY_FILES);
    setTuyenDuongList([]);
    resetFileInputs();
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [jobTypeData, xaPhuongData] = await Promise.all([
          GuiKeHoachService.getDanhMucCongViec(),
          LocationService.getXaPhuongList(),
        ]);

        setJobTypes(jobTypeData);
        setXaPhuongList(xaPhuongData);
      } catch (error) {
        setNotice({
          type: 'error',
          text: getApiErrorMessage(error, 'Không thể tải dữ liệu lập kế hoạch'),
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

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

  const validateForm = () => {
    if (!form.maLoaiCongViec) return 'Vui lòng chọn loại kế hoạch';
    if (!form.maXaPhuong) return 'Vui lòng chọn xã/phường trước khi chọn tuyến đường';
    if (!form.maTuyenDuong) return 'Vui lòng chọn tuyến đường';
    if (!form.tieuDe.trim()) return 'Vui lòng nhập tiêu đề kế hoạch';
    if (form.tieuDe.trim().length > 200) return 'Tiêu đề kế hoạch không được vượt quá 200 ký tự';
    if (!form.moTa.trim()) return 'Vui lòng nhập mô tả ngắn';
    if (form.moTa.trim().length > 500) return 'Mô tả ngắn không được vượt quá 500 ký tự';
    if (!files.fileKeHoach) return 'Vui lòng tải file PDF kế hoạch';

    if (requiresPermitFile && !files.fileDeNghiCapPhep) {
      return 'Vui lòng tải file PDF đề nghị cấp phép cho kế hoạch chặt hạ/di chuyển';
    }

    return '';
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append('maLoaiCongViec', form.maLoaiCongViec);
    formData.append('tieuDe', form.tieuDe.trim());
    formData.append('moTa', form.moTa.trim());
    formData.append('maTuyenDuong', form.maTuyenDuong);

    if (files.fileKeHoach) formData.append('fileKeHoach', files.fileKeHoach);
    if (files.fileDeNghiCapPhep) formData.append('fileDeNghiCapPhep', files.fileDeNghiCapPhep);

    return formData;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      setNotice({ type: 'error', text: validationMessage });
      return;
    }

    try {
      setSubmitting(true);
      setNotice(null);

      await GuiKeHoachService.createKeHoach(buildFormData());
      setNotice({ type: 'success', text: 'Gửi kế hoạch thành công' });
      resetForm();
    } catch (error) {
      setNotice({
        type: 'error',
        text: getApiErrorMessage(error, 'Không thể gửi kế hoạch, vui lòng thử lại'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="send-plan-page">
      <div className="send-plan-header">
        <div>
          <h1>Lập kế hoạch</h1>
          <p>Tạo mới và gửi hồ sơ kế hoạch PDF của nhân viên kỹ thuật</p>
        </div>
      </div>

      {notice && (
        <div className={`send-plan-notice ${notice.type}`}>
          <span className="material-symbols-outlined">
            {notice.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {notice.text}
        </div>
      )}

      <form className="send-plan-form" onSubmit={handleSubmit}>
        <div className="send-plan-form-title">
          <span className="material-symbols-outlined">upload_file</span>
          <h2>Tạo kế hoạch mới</h2>
        </div>

        <div className="send-plan-grid">
          <label className="send-plan-field">
            <span>Loại kế hoạch</span>
            <select
              name="maLoaiCongViec"
              value={form.maLoaiCongViec}
              onChange={handleInputChange}
              disabled={loading}
              required
            >
              <option value="">Chọn loại kế hoạch</option>
              {filteredJobTypes.map((item) => (
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
              disabled={loading}
              required
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
              required
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
              required
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
              required
            />
          </label>

          <div className="send-plan-field">
            <span>File PDF kế hoạch</span>
            <input
              ref={fileKeHoachRef}
              name="fileKeHoach"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              required
            />
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
            <input
              ref={fileDeNghiRef}
              name="fileDeNghiCapPhep"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              required={requiresPermitFile}
            />
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

        <div className="send-plan-actions">
          <button type="submit" className="send-plan-primary-btn" disabled={submitting || loading}>
            <span className="material-symbols-outlined">send</span>
            Gửi kế hoạch
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuiKeHoachCongViec;
