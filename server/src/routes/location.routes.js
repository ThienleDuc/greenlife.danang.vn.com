const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location.controller");

// Lấy tất cả xã phường
router.get("/xa-phuong", locationController.getXaPhuong);

// Lấy tuyến đường theo mã xã phường
router.get("/tuyen-duong/:maXaPhuong", locationController.getTuyenDuong);

module.exports = router;
