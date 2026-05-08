const express = require("express");
const router = express.Router();
const thongKeController = require("../controllers/thongke.controller");
const { authorize } = require("../middlewares/auth.middleware");

// Cán bộ quản lý có quyền vào trang thống kê
router.get("/thong-ke/tong-quan", authorize(['CBQL', 'QTHT']), thongKeController.getThongKeTongQuan);
router.get("/thong-ke/xuat-excel", authorize(['CBQL', 'QTHT']), thongKeController.exportExcel);
router.get("/thong-ke/xuat-pdf", authorize(['CBQL', 'QTHT']), thongKeController.exportPDF);

module.exports = router;
