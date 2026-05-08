const thongKeRepository = require("../repositories/thongke.repository");
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit-table');

// Hàm hỗ trợ loại bỏ dấu tiếng Việt để PDFKit chuẩn hiển thị không bị lỗi
function removeAccents(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
}

const getTongQuan = async (tuNgay, denNgay, maTuyenDuong, maXaPhuong) => {
  const data = await thongKeRepository.getThongKeData(tuNgay, denNgay, maTuyenDuong, maXaPhuong);
  
  // Tính tổng quan
  let tongTao = data.length;
  let tongDuyet = 0;
  let tongTuChoi = 0;
  
  // Tính dữ liệu biểu đồ (nhóm theo ngày)
  const chartDataMap = {};
  
  data.forEach(item => {
    const trangThaiStr = (item.TrangThai || '').toLowerCase();
    
    // Group by ngày cho biểu đồ
    const dateStr = item.NgayTao ? new Date(item.NgayTao).toLocaleDateString('vi-VN') : 'N/A';
    
    if (!chartDataMap[dateStr]) {
      chartDataMap[dateStr] = { date: dateStr, taoMoi: 0, daDuyet: 0, tuChoi: 0, dangThamDinh: 0 };
    }
    
    chartDataMap[dateStr].taoMoi++;
    
    if (trangThaiStr.includes('phê duyệt') || trangThaiStr.includes('được duyệt') || trangThaiStr.includes('đã duyệt')) {
      chartDataMap[dateStr].daDuyet++;
      tongDuyet++;
    } else if (trangThaiStr.includes('từ chối') || trangThaiStr.includes('không duyệt')) {
      chartDataMap[dateStr].tuChoi++;
      tongTuChoi++;
    } else {
      chartDataMap[dateStr].dangThamDinh++;
    }
  });
  
  // Sort chart data by date
  const chartData = Object.values(chartDataMap).sort((a, b) => {
    if (a.date === 'N/A') return -1;
    if (b.date === 'N/A') return 1;
    const [d1, m1, y1] = a.date.split('/');
    const [d2, m2, y2] = b.date.split('/');
    return new Date(`${y1}-${m1}-${d1}`) - new Date(`${y2}-${m2}-${d2}`);
  });

  return {
    tongQuan: { tongTao, tongDuyet, tongTuChoi },
    chartData,
    rawData: data
  };
};

const exportExcel = async (tuNgay, denNgay, nguoiXuat, maTuyenDuong, maXaPhuong) => {
  const { rawData } = await getTongQuan(tuNgay, denNgay, maTuyenDuong, maXaPhuong);
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Thống kê Kế hoạch');
  
  // Top Headers
  worksheet.mergeCells('A1:B1');
  worksheet.getCell('A1').value = 'UBND THÀNH PHỐ ĐÀ NẴNG';
  worksheet.getCell('A1').font = { name: 'Times New Roman', size: 11, bold: true };
  worksheet.getCell('A1').alignment = { horizontal: 'center' };

  worksheet.mergeCells('A2:B2');
  worksheet.getCell('A2').value = 'SỞ XÂY DỰNG';
  worksheet.getCell('A2').font = { name: 'Times New Roman', size: 11, bold: true };
  worksheet.getCell('A2').alignment = { horizontal: 'center' };

  worksheet.mergeCells('E1:H1');
  worksheet.getCell('E1').value = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
  worksheet.getCell('E1').font = { name: 'Times New Roman', size: 11, bold: true };
  worksheet.getCell('E1').alignment = { horizontal: 'center' };

  worksheet.mergeCells('E2:H2');
  worksheet.getCell('E2').value = 'Độc lập - Tự do - Hạnh phúc';
  worksheet.getCell('E2').font = { name: 'Times New Roman', size: 11, bold: true };
  worksheet.getCell('E2').alignment = { horizontal: 'center' };
  
  // Tiêu đề báo cáo
  worksheet.mergeCells('A4:H4');
  worksheet.getCell('A4').value = 'BÁO CÁO THỐNG KÊ TÌNH HÌNH THẨM ĐỊNH KẾ HOẠCH';
  worksheet.getCell('A4').font = { name: 'Times New Roman', size: 14, bold: true };
  worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('A5:H5');
  const tuNgayStr = tuNgay ? new Date(tuNgay).toLocaleDateString('vi-VN') : '...';
  const denNgayStr = denNgay ? new Date(denNgay).toLocaleDateString('vi-VN') : '...';
  worksheet.getCell('A5').value = `Từ ngày: ${tuNgayStr} - Đến ngày: ${denNgayStr}`;
  worksheet.getCell('A5').font = { name: 'Times New Roman', size: 11, italic: true };
  worksheet.getCell('A5').alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('A6:H6');
  worksheet.getCell('A6').value = `Người xuất báo cáo: ${nguoiXuat || 'Cán bộ quản lý'}`;
  worksheet.getCell('A6').font = { name: 'Times New Roman', size: 11, italic: true };
  worksheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center' };
  
  // Add Table Headers
  const headerRow = worksheet.getRow(8);
  headerRow.values = ['Mã Kế Hoạch', 'Tiêu Đề', 'Tuyến Đường', 'Loại Công Việc', 'Ngày Tạo', 'Trạng Thái', 'Người Lập', 'Người Phê Duyệt'];
  headerRow.font = { bold: true, name: 'Times New Roman' };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.columns = [
    { key: 'maKeHoach', width: 15 },
    { key: 'tieuDe', width: 35 },
    { key: 'tuyenDuong', width: 25 },
    { key: 'loaiCongViec', width: 20 },
    { key: 'ngayTao', width: 15 },
    { key: 'trangThai', width: 20 },
    { key: 'nguoiLap', width: 25 },
    { key: 'nguoiPheDuyet', width: 25 }
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
      item.TrangThai,
      item.NguoiLap,
      item.NguoiPheDuyet || ''
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

  worksheet.mergeCells(`F${startRow}:H${startRow}`);
  worksheet.getCell(`F${startRow}`).value = 'Giám đốc / Cán bộ quản lý';
  worksheet.getCell(`F${startRow}`).font = { name: 'Times New Roman', size: 11, bold: true };
  worksheet.getCell(`F${startRow}`).alignment = { horizontal: 'center' };

  startRow += 1;
  worksheet.mergeCells(`A${startRow}:B${startRow}`);
  worksheet.getCell(`A${startRow}`).value = '(Ký, ghi rõ họ tên)';
  worksheet.getCell(`A${startRow}`).font = { name: 'Times New Roman', size: 11, italic: true };
  worksheet.getCell(`A${startRow}`).alignment = { horizontal: 'center' };

  worksheet.mergeCells(`F${startRow}:H${startRow}`);
  worksheet.getCell(`F${startRow}`).value = '(Ký, ghi rõ họ tên)';
  worksheet.getCell(`F${startRow}`).font = { name: 'Times New Roman', size: 11, italic: true };
  worksheet.getCell(`F${startRow}`).alignment = { horizontal: 'center' };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

const exportPDF = async (tuNgay, denNgay, nguoiXuat, maTuyenDuong, maXaPhuong) => {
  const { rawData, tongQuan } = await getTongQuan(tuNgay, denNgay, maTuyenDuong, maXaPhuong);
  
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
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
      
      // Cơ quan
      doc.fontSize(11).font('Arial').text('UBND THÀNH PHỐ ĐÀ NẴNG', 85, currentY);
      doc.fontSize(11).font('Arial').text('GREENLIFE ĐÀ NẴNG', 85, currentY + 15);
      
      // Line dưới cơ quan
      doc.moveTo(100, currentY + 30).lineTo(180, currentY + 30).stroke();

      // Quốc hiệu
      doc.fontSize(11).font('Arial').text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 0, currentY, { align: 'right' });
      doc.fontSize(12).font('Arial').text('Độc lập - Tự do - Hạnh phúc', 0, currentY + 15, { align: 'right' });
      
      // Line dưới quốc hiệu
      const rightX = doc.page.width - 30; // margin right
      doc.moveTo(rightX - 180, currentY + 35).lineTo(rightX - 40, currentY + 35).stroke();

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
      doc.fontSize(12).text('I. TỔNG QUAN', 30, doc.y);
      doc.moveDown(0.5);
      
      // Box vẽ bằng line
      const boxY = doc.y;
      doc.rect(30, boxY, 300, 70).strokeColor('#e5e7eb').stroke();
      doc.fontSize(11);
      doc.text(`- Tổng số kế hoạch tạo mới: ${tongQuan.tongTao}`, 40, boxY + 10);
      doc.text(`- Tổng số kế hoạch đã phê duyệt: ${tongQuan.tongDuyet}`, 40, boxY + 30);
      doc.text(`- Tổng số kế hoạch bị từ chối: ${tongQuan.tongTuChoi}`, 40, boxY + 50);
      
      doc.moveDown(2);
      
      // Table
      doc.y = boxY + 90;
      doc.fontSize(12).text('II. CHI TIẾT KẾ HOẠCH', 30, doc.y);
      doc.moveDown(0.5);

      const table = {
        title: "",
        headers: [
          { label: "Mã KH", property: 'ma', width: 55 },
          { label: "Tiêu đề", property: 'tieuDe', width: 200 },
          { label: "Tuyến Đường", property: 'tuyenDuong', width: 110 },
          { label: "Loại CV", property: 'loaiCv', width: 70 },
          { label: "Ngày tạo", property: 'ngay', width: 65 },
          { label: "Trạng thái", property: 'trangThai', width: 70 },
          { label: "Người lập", property: 'nguoiLap', width: 90 },
          { label: "Người phê duyệt", property: 'nguoiPheDuyet', width: 90 }
        ],
        rows: rawData.map(item => [
          item.MaKeHoach || '',
          item.TieuDe || '',
          item.TenTuyenDuong || '',
          item.TenCongViec || '',
          item.NgayTao ? new Date(item.NgayTao).toLocaleDateString('vi-VN') : '',
          item.TrangThai || '',
          item.NguoiLap || '',
          item.NguoiPheDuyet || ''
        ]),
      };
      
      await doc.table(table, {
        prepareHeader: () => doc.font('Arial').fontSize(10).fillColor('#374151'),
        prepareRow: () => doc.font('Arial').fontSize(9).fillColor('black'),
        padding: 5
      });
      
      // Chữ ký
      doc.moveDown(3);
      const signY = doc.y;
      
      // Trái
      doc.fontSize(11).text('Người lập biểu', 100, signY);
      doc.fontSize(10).text('(Ký, ghi rõ họ tên)', 100, signY + 15, { oblique: true });

      // Phải
      doc.fontSize(11).text('Giám đốc / Cán bộ quản lý', 550, signY);
      doc.fontSize(10).text('(Ký, ghi rõ họ tên)', 575, signY + 15, { oblique: true });
      
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
