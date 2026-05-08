const express = require("express");
const router = express.Router();
const danhmucController = require("../controllers/danhmuc.controller");

router.get("/danh-muc-cong-viec", danhmucController.getDanhMucCongViec);

module.exports = router;
