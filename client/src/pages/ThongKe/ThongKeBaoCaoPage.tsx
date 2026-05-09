import React, { useEffect, useState } from 'react';
import thongKeService, { type ThongKeTongQuanResponse } from '../../services/thongKeService';
import locationService from '../../services/locationService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import '../../styles/pages/ThongKeBaoCao.css';

const ThongKeBaoCaoPage: React.FC = () => {
  const [data, setData] = useState<ThongKeTongQuanResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [tuNgay, setTuNgay] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [denNgay, setDenNgay] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [maXaPhuong, setMaXaPhuong] = useState<string>('');
  const [maTuyenDuong, setMaTuyenDuong] = useState<string>('');

  const [xaPhuongs, setXaPhuongs] = useState<any[]>([]);
  const [tuyenDuongs, setTuyenDuongs] = useState<any[]>([]);
  const [allTuyenDuongs, setAllTuyenDuongs] = useState<any[]>([]);

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [exportType, setExportType] = useState<string>('excel');

  useEffect(() => {
    loadLocations();
    loadData(tuNgay, denNgay);
  }, []);

  const loadLocations = async () => {
    try {
      const [xpRes, tdRes] = await Promise.all([
        locationService.getXaPhuong(),
        locationService.getAllTuyenDuong()
      ]);
      setXaPhuongs(xpRes.data || []);
      setAllTuyenDuongs(tdRes.data || []);
      setTuyenDuongs(tdRes.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách địa điểm:", error);
    }
  };

  const handleXaPhuongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setMaXaPhuong(val);
    setMaTuyenDuong(''); // reset tuyến đường khi đổi xã phường

    if (val) {
      setTuyenDuongs(allTuyenDuongs.filter(td => td.MaXaPhuong === val));
    } else {
      setTuyenDuongs(allTuyenDuongs);
    }
  };

  const loadData = async (tu?: string, den?: string, maTd?: string, maXp?: string) => {
    setLoading(true);
    try {
      const res = await thongKeService.getThongKeTongQuan(tu, den, maTd, maXp);
      setData(res);
    } catch (error) {
      console.error('Lỗi lấy thống kê', error);
      alert('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (tuNgay && denNgay && new Date(tuNgay) > new Date(denNgay)) {
      setErrorMsg("Thời gian lọc không hợp lệ");
      return;
    }
    setErrorMsg('');
    loadData(tuNgay, denNgay, maTuyenDuong, maXaPhuong);
  };

  const handleExport = async () => {
    if (exportType === 'excel') {
      await handleExportExcel();
    } else {
      await handleExportPDF();
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await thongKeService.downloadExcel(tuNgay, denNgay, maTuyenDuong, maXaPhuong);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'BaoCaoThongKe.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      alert("Lỗi xuất Excel");
    }
  };

  const handleExportPDF = async () => {
    try {
      const blob = await thongKeService.downloadPDF(tuNgay, denNgay, maTuyenDuong, maXaPhuong);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'BaoCaoThongKe.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      alert("Lỗi xuất PDF");
    }
  };

  return (
    <div className="tkbc-container fade-in">
      <div className="tkbc-header">
        <h1 className="tkbc-title">Thống kê kế hoạch</h1>
        <div className="tkbc-actions">
          <select
            className="tkbc-select"
            style={{ fontWeight: 'var(--font-weight-medium)' }}
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
          >
            <option value="excel">File Excel</option>
            <option value="pdf">File PDF</option>
          </select>
          <button className="tkbc-btn-export" onClick={handleExport} disabled={loading}>
            <span className="material-symbols-outlined">download</span>
            Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="tkbc-filter-card">
        <h3 className="tkbc-filter-title">Bộ lọc thống kê</h3>
        {errorMsg && <div className="tkbc-error-msg">{errorMsg}</div>}
        <div className="tkbc-filter-grid">
          <div className="tkbc-filter-group">
            <label>Từ ngày</label>
            <input type="date" className="tkbc-input" value={tuNgay} onChange={e => setTuNgay(e.target.value)} />
          </div>
          <div className="tkbc-filter-group">
            <label>Đến ngày</label>
            <input type="date" className="tkbc-input" value={denNgay} onChange={e => setDenNgay(e.target.value)} />
          </div>
          <div className="tkbc-filter-group">
            <label>Xã phường</label>
            <select className="tkbc-select" value={maXaPhuong} onChange={handleXaPhuongChange}>
              <option value="">-- Tất cả --</option>
              {xaPhuongs.map(xp => (
                <option key={xp.MaXaPhuong} value={xp.MaXaPhuong}>{xp.TenXaPhuong}</option>
              ))}
            </select>
          </div>
          <div className="tkbc-filter-group">
            <label>Tuyến đường</label>
            <select className="tkbc-select" value={maTuyenDuong} onChange={e => setMaTuyenDuong(e.target.value)}>
              <option value="">-- Tất cả --</option>
              {tuyenDuongs.map(td => (
                <option key={td.MaTuyenDuong} value={td.MaTuyenDuong}>{td.TenTuyenDuong}</option>
              ))}
            </select>
          </div>
          <div className="tkbc-filter-group button-group">
            <button className="tkbc-btn-filter" onClick={handleFilter} disabled={loading}>
              <span className="material-symbols-outlined">filter_alt</span>
              Lọc dữ liệu
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="tkbc-loading">Đang tải dữ liệu...</div>
      ) : (
        <div className="tkbc-content">
          <div className="tkbc-summary-cards">
            <div className="tkbc-card primary">
              <span className="material-symbols-outlined tkbc-card-icon">assignment</span>
              <div className="tkbc-card-info">
                <h4>Tổng kế hoạch</h4>
                <h2>{data?.tongQuan?.tongTao || 0}</h2>
              </div>
            </div>
            <div className="tkbc-card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <span className="material-symbols-outlined tkbc-card-icon" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>pending_actions</span>
              <div className="tkbc-card-info">
                <h4>Đang thẩm định</h4>
                <h2>{data?.tongQuan?.tongThamDinh || 0}</h2>
              </div>
            </div>
            <div className="tkbc-card success">
              <span className="material-symbols-outlined tkbc-card-icon">check_circle</span>
              <div className="tkbc-card-info">
                <h4>Đã phê duyệt</h4>
                <h2>{data?.tongQuan?.tongDuyet || 0}</h2>
              </div>
            </div>
            <div className="tkbc-card danger">
              <span className="material-symbols-outlined tkbc-card-icon">cancel</span>
              <div className="tkbc-card-info">
                <h4>Bị từ chối</h4>
                <h2>{data?.tongQuan?.tongTuChoi || 0}</h2>
              </div>
            </div>
            <div className="tkbc-card" style={{ borderLeft: '4px solid #6b7280' }}>
              <span className="material-symbols-outlined tkbc-card-icon" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>block</span>
              <div className="tkbc-card-info">
                <h4>Đã hủy</h4>
                <h2>{data?.tongQuan?.tongHuy || 0}</h2>
              </div>
            </div>
          </div>

          <div className="tkbc-charts">
            {/* Biểu đồ xu hướng (Line chart) */}
            <div className="tkbc-chart-wrapper">
              <h3 className="tkbc-chart-title">Xu hướng theo thời gian</h3>
              <div style={{ height: 300 }}>
                {data && data.chartData && data.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} axisLine={{ stroke: 'var(--color-outline-variant)' }} />
                      <YAxis allowDecimals={false} tick={{ fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--color-outline-variant)' }} />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Line type="monotone" name="Tạo mới/Đã gửi" dataKey="taoMoi" stroke="var(--color-primary)" strokeWidth={2} activeDot={{ r: 8 }} />
                      <Line type="monotone" name="Đang thẩm định" dataKey="dangThamDinh" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" name="Đã duyệt" dataKey="daDuyet" stroke="var(--color-primary-container)" strokeWidth={2} />
                      <Line type="monotone" name="Từ chối" dataKey="tuChoi" stroke="var(--color-error)" strokeWidth={2} />
                      <Line type="monotone" name="Đã hủy" dataKey="daHuy" stroke="#6b7280" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-on-surface-variant)' }}>Không có dữ liệu trong khoảng thời gian này</div>
                )}
              </div>
            </div>

            {/* Biểu đồ so sánh (Bar chart) */}
            <div className="tkbc-chart-wrapper">
              <h3 className="tkbc-chart-title">Tương quan trạng thái</h3>
              <div style={{ height: 300 }}>
                {data && data.chartData && data.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} axisLine={{ stroke: 'var(--color-outline-variant)' }} />
                      <YAxis allowDecimals={false} tick={{ fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--color-outline-variant)' }} />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Bar name="Tạo mới/Đã gửi" dataKey="taoMoi" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                      <Bar name="Đang thẩm định" dataKey="dangThamDinh" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar name="Đã duyệt" dataKey="daDuyet" fill="var(--color-primary-container)" radius={[4, 4, 0, 0]} />
                      <Bar name="Từ chối" dataKey="tuChoi" fill="var(--color-error)" radius={[4, 4, 0, 0]} />
                      <Bar name="Đã hủy" dataKey="daHuy" fill="#6b7280" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-on-surface-variant)' }}>Không có dữ liệu trong khoảng thời gian này</div>
                )}
              </div>
            </div>
          </div>

          <div className="tkbc-table-wrapper">
            <h3 className="tkbc-table-title">Danh sách kế hoạch chi tiết</h3>
            <div className="tkbc-table-responsive">
              <table className="tkbc-table">
                <thead>
                  <tr>
                    <th>Mã KH</th>
                    <th>Tiêu đề</th>
                    <th>Tuyến đường</th>
                    <th>Loại CV</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Người lập</th>
                    <th>Người phê duyệt</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.rawData?.map((item: any, index: number) => {
                    const trangThaiLC = item.TrangThai?.toLowerCase() || '';
                    const isDuyet = trangThaiLC.includes('duyệt');
                    const isTuChoi = trangThaiLC.includes('từ chối');
                    const isDaGui = trangThaiLC.includes('gửi') || trangThaiLC.includes('tạo');
                    const isDaHuy = trangThaiLC.includes('hủy');
                    const isThamDinh = trangThaiLC.includes('thẩm định');

                    let badgeClass = 'default';
                    if (isDuyet) badgeClass = 'duyet';
                    else if (isTuChoi) badgeClass = 'tuchoi';
                    else if (isDaGui) badgeClass = 'dagui';
                    else if (isDaHuy) badgeClass = 'dahuy';
                    else if (isThamDinh) badgeClass = 'dangthamdinh';

                    return (
                      <tr key={index}>
                        <td style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-primary)' }}>#{item.MaKeHoach}</td>
                        <td>{item.TieuDe}</td>
                        <td>{item.TenTuyenDuong}</td>
                        <td>{item.TenCongViec}</td>
                        <td>{item.NgayTao ? new Date(item.NgayTao).toLocaleDateString('vi-VN') : ''}</td>
                        <td>
                          <span className={`tkbc-status-badge ${badgeClass}`}>
                            {item.TrangThai}
                          </span>
                        </td>
                        <td>{item.NguoiLap}</td>
                        <td>{item.NguoiPheDuyet || '-'}</td>
                      </tr>
                    );
                  })}
                  {(!data?.rawData || data.rawData.length === 0) && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-on-surface-variant)' }}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThongKeBaoCaoPage;
