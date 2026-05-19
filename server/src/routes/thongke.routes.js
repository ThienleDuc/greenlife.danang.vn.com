const express = require("express");
const router = express.Router();
const thongKeController = require("../controllers/thongke.controller");
const { authorize } = require("../middlewares/auth.middleware");
const { ROLE_CODES } = require("../utils/role.utils");

// Cán bộ quản lý có quyền vào trang thống kê
router.get("/thong-ke/tong-quan", authorize([ROLE_CODES.QUAN_LY, ROLE_CODES.ADMIN]), thongKeController.getThongKeTongQuan);
router.get("/thong-ke/xuat-excel", authorize([ROLE_CODES.QUAN_LY, ROLE_CODES.ADMIN]), thongKeController.exportExcel);
router.get("/thong-ke/xuat-pdf", authorize([ROLE_CODES.QUAN_LY, ROLE_CODES.ADMIN]), thongKeController.exportPDF);

module.exports = router;
