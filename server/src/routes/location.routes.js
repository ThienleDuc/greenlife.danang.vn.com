const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location.controller");

// Lấy tất cả xã phường
router.get("/xa-phuong", locationController.getXaPhuong);

// Lấy tất cả tuyến đường
router.get("/tuyen-duong", locationController.getAllTuyenDuong);

// Lấy tuyến đường theo mã xã phường
router.get("/tuyen-duong/:maXaPhuong", locationController.getTuyenDuong);

module.exports = router;
