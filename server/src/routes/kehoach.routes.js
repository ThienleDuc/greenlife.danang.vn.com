const express = require("express");
const router = express.Router();
const keHoachController = require("../controllers/kehoach.controller");

router.get("/ke-hoach", keHoachController.getAllKeHoach);
router.get("/ke-hoach/search", keHoachController.searchKeHoach);

module.exports = router;
