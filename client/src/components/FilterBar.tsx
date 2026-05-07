import React, { useState, useEffect } from 'react';
import type { FilterParams, XaPhuong, TuyenDuong } from '../types';
import { LocationService } from '../services/locationService';
import { TheoDoiKeHoachService } from '../services/kehoachService';

interface FilterBarProps {
  onSearch: (params: FilterParams) => void;
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onSearch, onReset }) => {
  const [showModal, setShowModal] = useState(false);
  const [xaPhuongList, setXaPhuongList] = useState<XaPhuong[]>([]);
  const [tuyenDuongList, setTuyenDuongList] = useState<TuyenDuong[]>([]);
  const [jobTypeList, setJobTypeList] = useState<any[]>([]);
  
  const [filters, setFilters] = useState<FilterParams>({
    title: '',
    status: 'Tất cả',
    startDate: '',
    endDate: '',
    dateType: 'NgayTao',
    jobType: '',
    processor: '',
    xaPhuong: '',
    tuyenDuong: '',
  });

  // Load danh sách ban đầu
  useEffect(() => {
    const fetchInitialData = async () => {
      const [xpData, jobData] = await Promise.all([
        LocationService.getXaPhuongList(),
        TheoDoiKeHoachService.getDanhMucCongViec()
      ]);
      setXaPhuongList(xpData);
      setJobTypeList(jobData);
    };
    fetchInitialData();
  }, []);

  // Load danh sách tuyến đường khi xã phường thay đổi
  useEffect(() => {
    const fetchTuyenDuong = async () => {
      if (filters.xaPhuong) {
        const data = await LocationService.getTuyenDuongList(filters.xaPhuong);
        setTuyenDuongList(data);
      } else {
        setTuyenDuongList([]);
      }
    };
    fetchTuyenDuong();
  }, [filters.xaPhuong]);

  const handleInputChange = (field: keyof FilterParams, value: string) => {
    if (field === 'xaPhuong') {
      setFilters({ ...filters, [field]: value, tuyenDuong: '' });
    } else {
      setFilters({ ...filters, [field]: value });
    }
  };

  const handleSearch = () => {
    onSearch(filters);
    setShowModal(false);
  };

  const handleReset = () => {
    setFilters({
      title: '',
      status: 'Tất cả',
      startDate: '',
      endDate: '',
      dateType: 'NgayTao',
      jobType: '',
      processor: '',
      xaPhuong: '',
      tuyenDuong: '',
    });
    onReset();
  };

  return (
    <>
      <section className="filter-section filter-vertical">
        <div className="filter-header">
          <div className="filter-header-left">
            <span className="material-symbols-outlined">filter_alt</span>
            <h2 className="filter-title">Bộ lọc tìm kiếm</h2>
          </div>
        </div>

        <div className="filter-grid-vertical">
          <div className="filter-field">
            <label className="filter-label">Tiêu đề kế hoạch</label>
            <div className="filter-input-icon">
              <span className="material-symbols-outlined">search</span>
              <input
                className="filter-input"
                placeholder="Tìm kiếm tiêu đề..."
                type="text"
                value={filters.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
        </div>

        <div className="filter-actions-vertical">
          <button className="filter-btn-search" onClick={handleSearch}>
            <span className="material-symbols-outlined">search</span>
            Tìm kiếm
          </button>
          <button className="filter-btn-advanced" onClick={() => setShowModal(true)}>
            <span className="material-symbols-outlined">tune</span>
            Tìm kiếm nâng cao
          </button>
          <button className="filter-btn-reset" onClick={handleReset}>
            <span className="material-symbols-outlined">restart_alt</span>
            Làm mới
          </button>
        </div>
      </section>

      {/* Advanced Filter Modal */}
      {showModal && (
        <div className="filter-modal-overlay">
          <div className="filter-modal-content">
            <div className="filter-modal-header">
              <h3 className="filter-modal-title">
                <span className="material-symbols-outlined">tune</span>
                Bộ lọc nâng cao
              </h3>
              <button className="filter-modal-close" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="filter-modal-body">
              <div className="filter-modal-grid">
                <div className="filter-field">
                  <label className="filter-label">Loại công việc</label>
                  <select
                    className="filter-select"
                    value={filters.jobType}
                    onChange={(e) => handleInputChange('jobType', e.target.value)}
                  >
                    <option value="">Tất cả loại công việc</option>
                    {jobTypeList.map(job => (
                      <option key={job.MaLoaiCongViec} value={job.MaLoaiCongViec}>
                        {job.TenCongViec}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-field">
                  <label className="filter-label">Trạng thái</label>
                  <select
                    className="filter-select"
                    value={filters.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option>Tất cả</option>
                    <option>Đã gửi</option>
                    <option>Đang thẩm định</option>
                    <option>Đã phê duyệt</option>
                    <option>Bị từ chối</option>
                    <option>Đã hủy</option>
                  </select>
                </div>

                <div className="filter-field">
                  <label className="filter-label">Nhân viên xử lý</label>
                  <input
                    className="filter-input"
                    placeholder="Nhập tên nhân viên..."
                    type="text"
                    value={filters.processor}
                    onChange={(e) => handleInputChange('processor', e.target.value)}
                  />
                </div>

                <div className="filter-field">
                  <label className="filter-label">Xã / Phường</label>
                  <select
                    className="filter-select"
                    value={filters.xaPhuong}
                    onChange={(e) => handleInputChange('xaPhuong', e.target.value)}
                  >
                    <option value="">Tất cả các phường</option>
                    {xaPhuongList.map(xp => (
                      <option key={xp.MaXaPhuong} value={xp.MaXaPhuong}>{xp.TenXaPhuong}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-field">
                  <label className="filter-label">Tuyến đường</label>
                  <select
                    className="filter-select"
                    value={filters.tuyenDuong}
                    onChange={(e) => handleInputChange('tuyenDuong', e.target.value)}
                    disabled={!filters.xaPhuong}
                  >
                    <option value="">{filters.xaPhuong ? 'Tất cả tuyến đường' : 'Chọn Phường trước'}</option>
                    {tuyenDuongList.map(td => (
                      <option key={td.MaTuyenDuong} value={td.MaTuyenDuong}>{td.TenTuyenDuong}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-field filter-field-full">
                  <label className="filter-label">Tìm kiếm theo loại ngày</label>
                  <div className="filter-radio-group">
                    <label className="filter-radio-label">
                      <input
                        type="radio"
                        name="dateType"
                        value="NgayTao"
                        checked={filters.dateType === 'NgayTao'}
                        onChange={(e) => handleInputChange('dateType', e.target.value)}
                      />
                      <span>Ngày tạo</span>
                    </label>
                    <label className="filter-radio-label">
                      <input
                        type="radio"
                        name="dateType"
                        value="NgayCapNhat"
                        checked={filters.dateType === 'NgayCapNhat'}
                        onChange={(e) => handleInputChange('dateType', e.target.value)}
                      />
                      <span>Ngày cập nhật</span>
                    </label>
                    <label className="filter-radio-label">
                      <input
                        type="radio"
                        name="dateType"
                        value="NgayPheDuyet"
                        checked={filters.dateType === 'NgayPheDuyet'}
                        onChange={(e) => handleInputChange('dateType', e.target.value)}
                      />
                      <span>Ngày phê duyệt</span>
                    </label>
                  </div>
                </div>

                <div className="filter-field">
                  <label className="filter-label">Từ ngày</label>
                  <input
                    className="filter-input"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div className="filter-field">
                  <label className="filter-label">Đến ngày</label>
                  <input
                    className="filter-input"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="filter-modal-footer">
              <button className="filter-btn-reset" onClick={handleReset}>
                <span className="material-symbols-outlined">restart_alt</span>
                Làm mới
              </button>
              <button className="filter-btn-search" onClick={handleSearch}>
                <span className="material-symbols-outlined">search</span>
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBar;