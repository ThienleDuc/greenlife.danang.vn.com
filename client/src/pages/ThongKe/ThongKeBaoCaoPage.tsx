import React, { useEffect, useState } from 'react';
import thongKeService, { type ThongKeTongQuanResponse } from '../../services/thongKeService';
import locationService from '../../services/locationService';
import { TheoDoiKeHoachService } from '../../services/kehoachService';
import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  Line, PieChart, Pie, Cell
} from 'recharts';
import '../../styles/pages/ThongKeBaoCao.css';
import Pagination from '../../components/Pagination';

const ThongKeBaoCaoPage: React.FC = () => {
  const [data, setData] = useState<ThongKeTongQuanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Bộ lọc thời gian
  const [tuNgay, setTuNgay] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [denNgay, setDenNgay] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Bộ lọc địa điểm
  const [maXaPhuong, setMaXaPhuong] = useState<string>('');
  const [maTuyenDuong, setMaTuyenDuong] = useState<string>('');
  const [xaPhuongs, setXaPhuongs] = useState<any[]>([]);
  const [tuyenDuongs, setTuyenDuongs] = useState<any[]>([]);
  const [allTuyenDuongs, setAllTuyenDuongs] = useState<any[]>([]);

  // Bộ lọc loại công việc, loại ngày, trạng thái
  const [loaiNgay, setLoaiNgay] = useState<string>('Tất cả');
  const [maLoaiCongViec, setMaLoaiCongViec] = useState<string>('');
  const [trangThai, setTrangThai] = useState<string>('');
  const [danhMucCongViecs, setDanhMucCongViecs] = useState<any[]>([]);

  // Trạng thái modal xem chi tiết theo ngày
  const [selectedDateForModal, setSelectedDateForModal] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Trạng thái dialog chọn thời gian
  const [showDateDialog, setShowDateDialog] = useState<boolean>(false);
  const [tempLoaiNgay, setTempLoaiNgay] = useState<string>('Tất cả');
  const [tempTuNgay, setTempTuNgay] = useState<string>('');
  const [tempDenNgay, setTempDenNgay] = useState<string>('');
  const [tempDateError, setTempDateError] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // Trạng thái loại xuất báo cáo
  const [exportType, setExportType] = useState<string>('excel');

  useEffect(() => {
    loadLocationsAndCategories();
    loadData(tuNgay, denNgay, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai, 1);
  }, []);

  const loadLocationsAndCategories = async () => {
    try {
      const [xpRes, tdRes, dmRes] = await Promise.all([
        locationService.getXaPhuong(),
        locationService.getAllTuyenDuong(),
        TheoDoiKeHoachService.getDanhMucCongViec()
      ]);
      setXaPhuongs(xpRes.data || []);
      setAllTuyenDuongs(tdRes.data || []);
      setTuyenDuongs(tdRes.data || []);
      setDanhMucCongViecs(dmRes || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách địa điểm/danh mục:", error);
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

  const loadData = async (
    tu?: string,
    den?: string,
    maTd?: string,
    maXp?: string,
    ln?: string,
    maCv?: string,
    tt?: string,
    page: number = 1
  ) => {
    setLoading(true);
    try {
      const res = await thongKeService.getThongKeTongQuan(tu, den, maTd, maXp, ln, maCv, tt, page, itemsPerPage);
      setData(res);
      setCurrentPage(page);
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
    loadData(tuNgay, denNgay, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai, 1);
  };

  const handleExport = async () => {
    try {
      let blob;
      let filename = '';
      const timestamp = getTimestamp();

      if (exportType === 'excel') {
        blob = await thongKeService.downloadExcel(tuNgay, denNgay, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai);
        filename = `BaoCaoThongKe_${timestamp}.xlsx`;
      } else if (exportType === 'pdf') {
        blob = await thongKeService.downloadPDF(tuNgay, denNgay, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai);
        filename = `BaoCaoThongKe_${timestamp}.pdf`;
      }

      if (!blob) return;

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      alert("Lỗi xuất báo cáo");
    }
  };

  const getTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  };

  // Nhấp chuột vào biểu đồ để mở Modal danh sách theo ngày
  const handleChartClick = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const payload = state.activePayload[0].payload;
      const clickedFullDate = payload.fullDate;
      setSelectedDateForModal(clickedFullDate);
      setShowModal(true);
    }
  };

  // Lọc kế hoạch thuộc ngày được click dựa trên loại ngày lọc
  const getPlansForSelectedDate = () => {
    const plansSource = data?.allRawData || data?.rawData || [];
    if (!selectedDateForModal || plansSource.length === 0) return [];
    return plansSource.filter(item => {
      let itemDate = item.NgayTao;
      if (loaiNgay === 'Đã phê duyệt') {
        itemDate = item.NgayPheDuyet;
      } else if (loaiNgay === 'Bị từ chối' || loaiNgay === 'Đã hủy') {
        itemDate = item.NgayXuLy;
      }
      if (!itemDate) return false;
      const formattedItemDate = new Date(itemDate).toISOString().split('T')[0];
      return formattedItemDate === selectedDateForModal;
    });
  };

  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedData = data?.rawData || [];

  // Lấy nhãn hiển thị cho nút lọc thời gian
  const getDateFilterLabel = () => {
    const loaiNgayText = loaiNgay || 'Tất cả';
    const tu = tuNgay ? new Date(tuNgay).toLocaleDateString('vi-VN') : '...';
    const den = denNgay ? new Date(denNgay).toLocaleDateString('vi-VN') : '...';
    return `${loaiNgayText}: ${tu} - ${den}`;
  };

  return (
    <div className="tkbc-container fade-in">
      <div className="tkbc-header">
        <h1 className="tkbc-title">Thống kê kế hoạch</h1>
        <div className="tkbc-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select 
            className="tkbc-select" 
            style={{ padding: '8px 12px', minWidth: '120px', backgroundColor: 'white' }}
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
          >
            <option value="excel">Excel (.xlsx)</option>
            <option value="pdf">PDF (.pdf)</option>
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
            <label>Thời gian thống kê</label>
            <button
              type="button"
              className="tkbc-btn-date-trigger"
              onClick={() => {
                setTempLoaiNgay(loaiNgay);
                setTempTuNgay(tuNgay);
                setTempDenNgay(denNgay);
                setShowDateDialog(true);
              }}
            >
              <span className="material-symbols-outlined">calendar_today</span>
              <span>{getDateFilterLabel()}</span>
            </button>
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
          <div className="tkbc-filter-group">
            <label>Loại công việc</label>
            <select className="tkbc-select" value={maLoaiCongViec} onChange={e => setMaLoaiCongViec(e.target.value)}>
              <option value="">-- Tất cả --</option>
              {danhMucCongViecs.map(dm => (
                <option key={dm.MaLoaiCongViec} value={dm.MaLoaiCongViec}>{dm.TenCongViec}</option>
              ))}
            </select>
          </div>
          {/* Trạng thái dropdown has been removed to avoid conflict with Loại kế hoạch */}
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

          <div className="tkbc-charts" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
            {/* Biểu đồ hỗn hợp (Combo chart) */}
            <div className="tkbc-chart-wrapper" style={{ flex: '1 1 60%', minWidth: '400px', maxWidth: '100%', overflow: 'hidden' }}>
              <h3 className="tkbc-chart-title">Thống kê & Xu hướng trạng thái kế hoạch</h3>
              <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
                <div style={{ 
                  height: 400, 
                  minWidth: data?.chartData && data.chartData.length > 8 ? `${data.chartData.length * 60}px` : '100%' 
                }}>
                  {data && data.chartData && data.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart 
                      data={data.chartData.map((item: any) => ({
                        ...item,
                        tongSo: (item.taoMoi || 0) + (item.dangThamDinh || 0) + (item.daDuyet || 0) + (item.tuChoi || 0) + (item.daHuy || 0)
                      }))} 
                      margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                      onClick={handleChartClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} axisLine={{ stroke: 'var(--color-outline-variant)' }} />
                      <YAxis allowDecimals={false} tick={{ fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--color-outline-variant)' }} />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      
                      {/* Stacked Bars cho các trạng thái */}
                      <Bar name="Tạo mới/Đã gửi" dataKey="taoMoi" stackId="a" fill="var(--color-primary)" />
                      <Bar name="Đang thẩm định" dataKey="dangThamDinh" stackId="a" fill="#f59e0b" />
                      <Bar name="Đã duyệt" dataKey="daDuyet" stackId="a" fill="var(--color-primary-container)" />
                      <Bar name="Từ chối" dataKey="tuChoi" stackId="a" fill="var(--color-error)" />
                      <Bar name="Đã hủy" dataKey="daHuy" stackId="a" fill="#6b7280" />

                      {/* Line cho Tổng số */}
                      <Line type="monotone" name="Tổng số kế hoạch" dataKey="tongSo" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-on-surface-variant)' }}>Không có dữ liệu trong khoảng thời gian này</div>
                )}
                </div>
              </div>
            </div>

            {/* Biểu đồ tròn (Donut chart) - Chỉ hiển thị khi xem Tất cả trạng thái */}
            {loaiNgay === 'Tất cả' && (
              <div className="tkbc-chart-wrapper" style={{ flex: '1 1 35%', minWidth: '300px' }}>
                <h3 className="tkbc-chart-title">Tỷ trọng trạng thái tổng quan</h3>
              <div style={{ height: 400 }}>
                {data && data.tongQuan ? (
                  (() => {
                    const tongKhac = (data.tongQuan.tongThamDinh || 0) + (data.tongQuan.tongDuyet || 0) + (data.tongQuan.tongTuChoi || 0) + (data.tongQuan.tongHuy || 0);
                    const actualTaoMoi = Math.max(0, (data.tongQuan.tongTao || 0) - tongKhac);
                    
                    const pieData = [
                      { name: 'Tạo mới/Đã gửi', value: actualTaoMoi, color: 'var(--color-primary)' },
                      { name: 'Đang thẩm định', value: data.tongQuan.tongThamDinh || 0, color: '#f59e0b' },
                      { name: 'Đã duyệt', value: data.tongQuan.tongDuyet || 0, color: 'var(--color-primary-container)' },
                      { name: 'Từ chối', value: data.tongQuan.tongTuChoi || 0, color: 'var(--color-error)' },
                      { name: 'Đã hủy', value: data.tongQuan.tongHuy || 0, color: '#6b7280' }
                    ].filter(item => item.value > 0);

                    if (pieData.length === 0) {
                      return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-on-surface-variant)' }}>Không có dữ liệu</div>;
                    }

                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={2}
                            dataKey="value"
                            labelLine={false}
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                              const RADIAN = Math.PI / 180;
                              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                              const x = cx + radius * Math.cos(-midAngle * RADIAN);
                              const y = cy + radius * Math.sin(-midAngle * RADIAN);
                              return (
                                <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="bold" style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.6)' }}>
                                  {percent > 0.05 ? `${(percent * 100).toFixed(1)}%` : ''}
                                </text>
                              );
                            }}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(value: number) => [value, 'Số lượng']} contentStyle={{ borderRadius: 8, border: '1px solid var(--color-outline-variant)' }} />
                          <Legend wrapperStyle={{ paddingTop: 10 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    );
                  })()
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-on-surface-variant)' }}>Không có dữ liệu</div>
                )}
              </div>
            </div>
            )}
          </div>

          <div className="tkbc-table-wrapper">
            <h3 className="tkbc-table-title">Danh sách kế hoạch chi tiết</h3>
            <div className="tkbc-table-responsive">
              <table className="tkbc-table">
                <thead>
                  <tr>
                    <th style={{ width: '6%' }}>Mã KH</th>
                    <th style={{ width: '14%' }}>Tiêu đề</th>
                    <th style={{ width: '10%' }}>Xã phường</th>
                    <th style={{ width: '14%' }}>Tuyến đường</th>
                    <th style={{ width: '10%' }}>Loại CV</th>
                    <th style={{ width: '8%' }}>Ngày tạo</th>
                    <th style={{ width: '8%' }}>Ngày Xử Lý</th>
                    <th style={{ width: '10%' }}>Trạng thái</th>
                    <th style={{ width: '10%' }}>Người lập</th>
                    <th style={{ width: '10%' }}>Người xử lý</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item: any, index: number) => {
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
                        <td title={`#${item.MaKeHoach}`} style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-primary)' }}>#{item.MaKeHoach}</td>
                        <td title={item.TieuDe || ''}>{item.TieuDe}</td>
                        <td title={item.TenXaPhuong || '-'}>{item.TenXaPhuong || '-'}</td>
                        <td title={item.TenTuyenDuong || ''}>{item.TenTuyenDuong}</td>
                        <td title={item.TenCongViec || ''}>{item.TenCongViec}</td>
                        <td title={item.NgayTao ? new Date(item.NgayTao).toLocaleDateString('vi-VN') : ''}>{item.NgayTao ? new Date(item.NgayTao).toLocaleDateString('vi-VN') : ''}</td>
                        <td title={item.NgayXuLy ? new Date(item.NgayXuLy).toLocaleDateString('vi-VN') : '-'}>{item.NgayXuLy ? new Date(item.NgayXuLy).toLocaleDateString('vi-VN') : '-'}</td>
                        <td title={item.TrangThai || ''}>
                          <span className={`tkbc-status-badge ${badgeClass}`}>
                            {item.TrangThai}
                          </span>
                        </td>
                        <td title={item.NguoiLap || ''}>{item.NguoiLap || '-'}</td>
                        <td title={item.NguoiXuLy || ''}>{item.NguoiXuLy || '-'}</td>
                      </tr>
                    );
                  })}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-on-surface-variant)' }}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalItems > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => loadData(tuNgay, denNgay, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai, page)}
              />
            )}
          </div>
        </div>
      )}

      {/* Dialog chọn thời gian và loại ngày */}
      {showDateDialog && (
        <div className="tkbc-modal-backdrop" onClick={() => setShowDateDialog(false)}>
          <div className="tkbc-modal-container tkbc-date-dialog" onClick={e => e.stopPropagation()}>
            <div className="tkbc-modal-header">
              <h3 className="tkbc-modal-title">Cấu hình thời gian thống kê</h3>
              <button className="tkbc-modal-close-btn" onClick={() => setShowDateDialog(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="tkbc-modal-body">
              <div className="tkbc-filter-group" style={{ marginBottom: '16px' }}>
                <label>Trạng thái</label>
                <select
                  className="tkbc-select"
                  value={tempLoaiNgay}
                  onChange={e => setTempLoaiNgay(e.target.value)}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <option value="Tất cả">Tất cả</option>
                  <option value="Đã gửi">Đã gửi</option>
                  <option value="Đang thẩm định">Đang thẩm định</option>
                  <option value="Đã phê duyệt">Đã phê duyệt</option>
                  <option value="Bị từ chối">Bị từ chối</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div className="tkbc-filter-group">
                  <label>Từ ngày</label>
                  <input
                    type="date"
                    className="tkbc-input"
                    value={tempTuNgay}
                    onChange={e => setTempTuNgay(e.target.value)}
                    style={{ marginTop: '8px' }}
                  />
                </div>
                <div className="tkbc-filter-group">
                  <label>Đến ngày</label>
                  <input
                    type="date"
                    className="tkbc-input"
                    value={tempDenNgay}
                    onChange={e => setTempDenNgay(e.target.value)}
                    style={{ marginTop: '8px' }}
                  />
                </div>
              </div>

              {tempDateError && <div style={{ color: 'var(--color-error)', fontSize: '14px', marginBottom: '16px' }}>{tempDateError}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="tkbc-btn-secondary" onClick={() => setShowDateDialog(false)}>
                  Hủy
                </button>
                <button
                  type="button"
                  className="tkbc-btn-filter"
                  onClick={() => {
                    if (tempTuNgay && tempDenNgay && new Date(tempTuNgay) > new Date(tempDenNgay)) {
                      setTempDateError("Thời gian lọc không hợp lệ: Ngày bắt đầu không thể sau ngày kết thúc.");
                      return;
                    }
                    setLoaiNgay(tempLoaiNgay);
                    setTuNgay(tempTuNgay);
                    setDenNgay(tempDenNgay);
                    setShowDateDialog(false);
                    setErrorMsg('');
                    setTempDateError('');
                    loadData(tempTuNgay, tempDenNgay, maTuyenDuong, maXaPhuong, tempLoaiNgay, maLoaiCongViec, trangThai, 1);
                  }}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết kế hoạch theo ngày khi nhấp vào mốc biểu đồ */}
      {showModal && selectedDateForModal && (
        <div className="tkbc-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="tkbc-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="tkbc-modal-header">
              <h3 className="tkbc-modal-title">
                Danh sách kế hoạch ngày {selectedDateForModal === 'N/A' ? 'N/A' : new Date(selectedDateForModal).toLocaleDateString('vi-VN')}
              </h3>
              <button className="tkbc-modal-close-btn" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="tkbc-modal-body">
              <div className="tkbc-table-responsive">
                <table className="tkbc-table">
                  <thead>
                    <tr>
                      <th>Mã KH</th>
                      <th>Tiêu đề</th>
                      <th>Xã phường</th>
                      <th>Tuyến đường</th>
                      <th>Loại CV</th>
                      <th>Trạng thái</th>
                      <th>Người lập</th>
                      <th>Người xử lý</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPlansForSelectedDate().map((item: any, index: number) => {
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
                          <td>{item.TenXaPhuong || '-'}</td>
                          <td>{item.TenTuyenDuong}</td>
                          <td>{item.TenCongViec}</td>
                          <td>
                            <span className={`tkbc-status-badge ${badgeClass}`}>
                              {item.TrangThai}
                            </span>
                          </td>
                          <td>{item.NguoiLap || '-'}</td>
                          <td>{item.NguoiXuLy || '-'}</td>
                        </tr>
                      );
                    })}
                    {getPlansForSelectedDate().length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-on-surface-variant)' }}>
                          Không có kế hoạch nào trong ngày này
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThongKeBaoCaoPage;
