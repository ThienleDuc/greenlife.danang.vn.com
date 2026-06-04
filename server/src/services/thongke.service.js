const thongKeRepository = require("../repositories/thongke.repository");
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit-table');

// Hàm hỗ trợ loại bỏ dấu tiếng Việt để PDFKit chuẩn hiển thị không bị lỗi
function removeAccents(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
}

const getTongQuan = async (tuNgay, denNgay, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai, page, limit) => {
  // Lấy toàn bộ dữ liệu (không phân trang) đã lọc theo trạng thái (loaiNgay) để làm rawData và tính summary
  const filteredAllData = await thongKeRepository.getThongKeData(tuNgay, denNgay, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai);
  
  // Lấy dữ liệu phân trang cho bảng chi tiết (chỉ khi có page và limit)
  const paginatedData = (page && limit)
    ? await thongKeRepository.getThongKeData(tuNgay, denNgay, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai, page, limit)
    : filteredAllData;
  
  // Tính toán tổng quan và gom nhóm theo ngày từ filteredAllData
  const summary = filteredAllData.reduce((acc, row) => {
    const trangThaiStr = row.TrangThai ? row.TrangThai.toLowerCase() : '';
    
    // Mọi kế hoạch đều được tính vào "Tổng kế hoạch" (card đầu tiên)
    acc.tongTao++;
    
    // Gom nhóm theo ngày tương ứng với loại ngày lọc
    let dateValue = row.NgayTao;
    if (loaiNgay === 'Đã phê duyệt') {
      dateValue = row.NgayPheDuyet;
    } else if (loaiNgay === 'Bị từ chối' || loaiNgay === 'Đã hủy') {
      dateValue = row.NgayXuLy;
    }

    const dateStr = dateValue ? new Date(dateValue).toISOString().split('T')[0] : 'N/A';
    if (!acc.byDate[dateStr]) {
      acc.byDate[dateStr] = { taoMoi: 0, daDuyet: 0, tuChoi: 0, dangThamDinh: 0, daHuy: 0 };
    }
    
    if (trangThaiStr.includes('duyệt')) {
      acc.tongDuyet++;
      acc.byDate[dateStr].daDuyet++;
    } else if (trangThaiStr.includes('từ chối')) {
      acc.tongTuChoi++;
      acc.byDate[dateStr].tuChoi++;
    } else if (trangThaiStr.includes('hủy')) {
      acc.tongHuy++;
      acc.byDate[dateStr].daHuy++;
    } else if (trangThaiStr.includes('gửi') || trangThaiStr.includes('tạo')) {
      // Chỉ tính vào cột 'Tạo mới/Đã gửi' trên biểu đồ nếu đúng trạng thái này
      acc.byDate[dateStr].taoMoi++;
    } else {
      // Nếu không thuộc các trạng thái trên thì mặc định là đang thẩm định
      acc.tongThamDinh++;
      acc.byDate[dateStr].dangThamDinh++;
    }

    return acc;
  }, { 
    tongTao: 0, 
    tongDuyet: 0, 
    tongTuChoi: 0, 
    tongThamDinh: 0,
    tongHuy: 0,
    byDate: {} 
  });

  const chartData = Object.keys(summary.byDate).sort().map(date => ({
    date: date === 'N/A' ? 'N/A' : new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    fullDate: date,
    taoMoi: summary.byDate[date].taoMoi,
    daDuyet: summary.byDate[date].daDuyet,
    tuChoi: summary.byDate[date].tuChoi,
    dangThamDinh: summary.byDate[date].dangThamDinh,
    daHuy: summary.byDate[date].daHuy
  }));

  return {
    tongQuan: { 
        tongTao: summary.tongTao, 
        tongDuyet: summary.tongDuyet, 
        tongTuChoi: summary.tongTuChoi,
        tongThamDinh: summary.tongThamDinh,
        tongHuy: summary.tongHuy 
    },
    chartData,
    rawData: paginatedData,
    totalItems: filteredAllData.length,
    allRawData: filteredAllData
  };
};

const exportExcel = async (tuNgay, denNgay, nguoiXuat, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai) => {
  const { rawData } = await getTongQuan(tuNgay, denNgay, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai);
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Thống kê Kế hoạch');
  
  // Top Headers
  worksheet.mergeCells('A1:B1');
  worksheet.getCell('A1').value = 'UBND THÀNH PHỐ ĐÀ NẴNG';
  worksheet.getCell('A1').font = { name: 'Times New Roman', size: 11, bold: true };
  worksheet.getCell('A1').alignment = { horizontal: 'center' };

  worksheet.mergeCells('A2:B2');
  worksheet.getCell('A2').value = 'CÔNG TY GREENLIFE ĐÀ NẴNG';
  worksheet.getCell('A2').font = { name: 'Times New Roman', size: 11, bold: true };
  worksheet.getCell('A2').alignment = { horizontal: 'center' };

  worksheet.mergeCells('E1:J1');
  worksheet.getCell('E1').value = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
  worksheet.getCell('E1').font = { name: 'Times New Roman', size: 11, bold: true };
  worksheet.getCell('E1').alignment = { horizontal: 'center' };

  worksheet.mergeCells('E2:J2');
  worksheet.getCell('E2').value = 'Độc lập - Tự do - Hạnh phúc';
  worksheet.getCell('E2').font = { name: 'Times New Roman', size: 11, bold: true };
  worksheet.getCell('E2').alignment = { horizontal: 'center' };
  
  // Tiêu đề báo cáo
  worksheet.mergeCells('A4:J4');
  worksheet.getCell('A4').value = 'BÁO CÁO THỐNG KÊ TÌNH HÌNH THẨM ĐỊNH KẾ HOẠCH';
  worksheet.getCell('A4').font = { name: 'Times New Roman', size: 14, bold: true };
  worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('A5:J5');
  const tuNgayStr = tuNgay ? new Date(tuNgay).toLocaleDateString('vi-VN') : '...';
  const denNgayStr = denNgay ? new Date(denNgay).toLocaleDateString('vi-VN') : '...';
  worksheet.getCell('A5').value = `Từ ngày: ${tuNgayStr} - Đến ngày: ${denNgayStr}`;
  worksheet.getCell('A5').font = { name: 'Times New Roman', size: 11, italic: true };
  worksheet.getCell('A5').alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('A6:J6');
  worksheet.getCell('A6').value = `Người xuất báo cáo: ${nguoiXuat || 'Cán bộ quản lý'}`;
  worksheet.getCell('A6').font = { name: 'Times New Roman', size: 11, italic: true };
  worksheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center' };
  
  // Add Table Headers
  const headerRow = worksheet.getRow(8);
  headerRow.values = ['Mã Kế Hoạch', 'Tiêu Đề', 'Tuyến Đường', 'Loại Công Việc', 'Ngày Tạo', 'Ngày Xử Lý', 'Trạng Thái', 'Người Lập', 'Người Xử Lý'];
  headerRow.font = { bold: true, name: 'Times New Roman' };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.columns = [
    { key: 'maKeHoach', width: 15 },
    { key: 'tieuDe', width: 35 },
    { key: 'tuyenDuong', width: 25 },
    { key: 'loaiCongViec', width: 20 },
    { key: 'ngayTao', width: 15 },
    { key: 'ngayXuLy', width: 15 },
    { key: 'trangThai', width: 15 },
    { key: 'nguoiLap', width: 20 },
    { key: 'nguoiXuLyName', width: 20 }
  ];
  
  // Add Data
  let startRow = 9;
  rawData.forEach(item => {
    const row = worksheet.getRow(startRow);
    row.values = [
      item.MaKeHoach,
      item.TieuDe,
      item.TenTuyenDuong || '',
      item.TenCongViec || '',
      item.NgayTao ? new Date(item.NgayTao).toLocaleDateString('vi-VN') : '',
      item.NgayXuLy ? new Date(item.NgayXuLy).toLocaleDateString('vi-VN') : '',
      item.TrangThai,
      item.NguoiLap,
      item.NguoiXuLy || ''
    ];
    row.font = { name: 'Times New Roman', size: 11 };
    startRow++;
  });
  
  // Signatures
  startRow += 2;
  worksheet.mergeCells(`A${startRow}:B${startRow}`);
  worksheet.getCell(`A${startRow}`).value = 'Người lập biểu';
  worksheet.getCell(`A${startRow}`).font = { name: 'Times New Roman', size: 11, bold: true };
  worksheet.getCell(`A${startRow}`).alignment = { horizontal: 'center' };

  worksheet.mergeCells(`H${startRow}:J${startRow}`);
  worksheet.getCell(`H${startRow}`).value = 'Giám đốc / Cán bộ quản lý';
  worksheet.getCell(`H${startRow}`).font = { name: 'Times New Roman', size: 11, bold: true };
  worksheet.getCell(`H${startRow}`).alignment = { horizontal: 'center' };

  startRow += 1;
  worksheet.mergeCells(`A${startRow}:B${startRow}`);
  worksheet.getCell(`A${startRow}`).value = '(Ký, ghi rõ họ tên)';
  worksheet.getCell(`A${startRow}`).font = { name: 'Times New Roman', size: 11, italic: true };
  worksheet.getCell(`A${startRow}`).alignment = { horizontal: 'center' };

  worksheet.mergeCells(`H${startRow}:J${startRow}`);
  worksheet.getCell(`H${startRow}`).value = '(Ký, ghi rõ họ tên)';
  worksheet.getCell(`H${startRow}`).font = { name: 'Times New Roman', size: 11, italic: true };
  worksheet.getCell(`H${startRow}`).alignment = { horizontal: 'center' };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

const exportPDF = async (tuNgay, denNgay, nguoiXuat, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai) => {
  const { rawData, tongQuan } = await getTongQuan(tuNgay, denNgay, maTuyenDuong, maXaPhuong, loaiNgay, maLoaiCongViec, trangThai);
  
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margins: { top: 30, left: 30, right: 30, bottom: 60 }, 
        size: 'A4', 
        layout: 'landscape' 
      });
      // Nạp font Arial hỗ trợ tiếng Việt trên Windows
      doc.registerFont('Arial', 'C:/Windows/Fonts/arial.ttf');
      doc.font('Arial');

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      // Top Header
      const currentY = doc.y;

      // Logo
      const logoPath = require('path').join(__dirname, '../assets/greenlife_logo.png');
      try {
        doc.image(logoPath, 30, currentY, { width: 45 });
      } catch (e) {
        console.error("Lỗi load logo:", e);
      }
      
      // Cột trái: Cơ quan
      doc.fontSize(11).font('Arial').text('UBND THÀNH PHỐ ĐÀ NẴNG', 80, currentY, { width: 220, align: 'center' });
      doc.fontSize(11).font('Arial').text('CÔNG TY GREENLIFE ĐÀ NẴNG', 80, currentY + 15, { width: 220, align: 'center' });
      
      // Line dưới cơ quan (căn giữa phần chữ)
      doc.moveTo(140, currentY + 32).lineTo(240, currentY + 32).stroke();

      // Cột phải: Quốc hiệu
      const rightColX = doc.page.width - 30 - 320; // 320 is width of text box
      doc.fontSize(11).font('Arial').text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', rightColX, currentY, { width: 320, align: 'center' });
      doc.fontSize(12).font('Arial').text('Độc lập - Tự do - Hạnh phúc', rightColX, currentY + 15, { width: 320, align: 'center' });
      
      // Line dưới quốc hiệu (căn giữa phần chữ)
      const rightCenter = rightColX + 160;
      doc.moveTo(rightCenter - 70, currentY + 32).lineTo(rightCenter + 70, currentY + 32).stroke();

      doc.moveDown(5);
      
      // Tiêu đề báo cáo
      doc.fontSize(16).fillColor('#059669').text('BÁO CÁO THỐNG KÊ TÌNH HÌNH KẾ HOẠCH', 0, doc.y, { align: 'center' });
      doc.fillColor('black');

      const tuNgayStr = tuNgay ? new Date(tuNgay).toLocaleDateString('vi-VN') : '...';
      const denNgayStr = denNgay ? new Date(denNgay).toLocaleDateString('vi-VN') : '...';
      doc.moveDown(0.5);
      doc.fontSize(11).text(`(Thời gian: Từ ${tuNgayStr} đến ${denNgayStr})`, { align: 'center', oblique: true });
      doc.moveDown(0.5);
      
      doc.fontSize(11).text(`Người xuất báo cáo: ${nguoiXuat || 'Cán bộ quản lý'}`, { align: 'center', oblique: true });
      doc.moveDown(1.5);
      
      // Summary Box
      doc.fontSize(12).text('I. TỔNG QUAN TÌNH HÌNH KẾ HOẠCH', 30, doc.y);
      doc.moveDown(0.5);
      
      // Box vẽ bằng line full width
      const boxY = doc.y;
      doc.rect(30, boxY, doc.page.width - 60, 80).strokeColor('#e5e7eb').stroke();
      doc.fontSize(11).fillColor('#1f2937');
      doc.text(`• Tổng số kế hoạch tạo mới trong kỳ: ${tongQuan.tongTao}`, 45, boxY + 15);
      doc.text(`• Số lượng đang thẩm định: ${tongQuan.tongThamDinh}`, 45, boxY + 35);
      doc.text(`• Số lượng đã được phê duyệt: ${tongQuan.tongDuyet}`, 45, boxY + 55);
      
      doc.text(`• Số lượng bị từ chối: ${tongQuan.tongTuChoi}`, 400, boxY + 15);
      doc.text(`• Số lượng đã hủy: ${tongQuan.tongHuy}`, 400, boxY + 35);
      doc.fillColor('black');
      
      // Table
      doc.y = boxY + 100;
      doc.fontSize(12).text('II. CHI TIẾT KẾ HOẠCH', 30, doc.y);
      doc.moveDown(0.5);

      const table = {
        title: "",
        headers: [
          { label: "Mã KH", property: 'ma', width: 60 },
          { label: "Tiêu đề", property: 'tieuDe', width: 150 },
          { label: "Xã Phường", property: 'xaPhuong', width: 100 },
          { label: "Tuyến Đường", property: 'tuyenDuong', width: 100 },
          { label: "Loại CV", property: 'loaiCv', width: 80 },
          { label: "Ngày tạo", property: 'ngay', width: 70 },
          { label: "Trạng thái", property: 'trangThai', width: 75 },
          { label: "Người lập", property: 'nguoiLap', width: 75 },
          { label: "Người xử lý", property: 'nguoiXuLyName', width: 70 }
        ],
        rows: rawData.map(item => [
          item.MaKeHoach || '',
          item.TieuDe || '',
          item.TenXaPhuong || '',
          item.TenTuyenDuong || '',
          item.TenCongViec || '',
          item.NgayTao ? new Date(item.NgayTao).toLocaleDateString('vi-VN') : '',
          item.TrangThai || '',
          item.NguoiLap || '',
          item.NguoiXuLy || ''
        ]),
      };
      
      const oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 100; // Tăng bottom margin để pdfkit-table ngắt trang sớm, tránh cắt đôi dòng
      
      await doc.table(table, {
        prepareHeader: () => doc.font('Arial').fontSize(9).fillColor('#374151'),
        prepareRow: () => doc.font('Arial').fontSize(8.5).fillColor('black'),
        padding: 5
      });
      
      doc.page.margins.bottom = oldBottomMargin;
      
      // Chữ ký
      if (doc.y > doc.page.height - doc.page.margins.bottom - 100) {
        doc.addPage();
      } else {
        doc.moveDown(3);
      }
      
      const signY = doc.y;
      
      // Ngày tháng năm xuất báo cáo (Cột phải)
      const now = new Date();
      const exportDateStr = `Đà Nẵng, ngày ${String(now.getDate()).padStart(2, '0')} tháng ${String(now.getMonth() + 1).padStart(2, '0')} năm ${now.getFullYear()}`;
      
      // Trái
      doc.fontSize(11).text('NGƯỜI LẬP BIỂU', 30, signY + 20, { width: 300, align: 'center' });
      doc.fontSize(10).text('(Ký, ghi rõ họ tên)', 30, signY + 35, { width: 300, align: 'center', oblique: true });

      // Phải
      const rightSignX = doc.page.width - 30 - 300;
      doc.fontSize(11).text(exportDateStr, rightSignX, signY, { width: 300, align: 'center' });
      doc.fontSize(11).text('GIÁM ĐỐC / CÁN BỘ QUẢN LÝ', rightSignX, signY + 20, { width: 300, align: 'center' });
      doc.fontSize(10).text('(Ký, ghi rõ họ tên, đóng dấu)', rightSignX, signY + 35, { width: 300, align: 'center', oblique: true });
      
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  getTongQuan,
  exportExcel,
  exportPDF
};
