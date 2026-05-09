const express = require("express");
const router = express.Router();
const pheDuyetController = require("../controllers/pheduyet.controller");

router.get("/phe-duyet/ke-hoach", pheDuyetController.getAllKeHoachPheDuyet);
router.get("/phe-duyet/ke-hoach/search", pheDuyetController.searchKeHoachPheDuyet);
router.get("/phe-duyet/ke-hoach/:maKeHoach", pheDuyetController.getKeHoachChiTiet);
router.put("/phe-duyet/ke-hoach/:maKeHoach/trang-thai", pheDuyetController.updateTrangThaiPheDuyet);

module.exports = router;
