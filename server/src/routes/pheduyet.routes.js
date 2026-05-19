const express = require("express");
const router = express.Router();
const pheDuyetController = require("../controllers/pheduyet.controller");
const multer = require("multer");
const path = require("path");
const { authorize } = require("../middlewares/auth.middleware");
const { ROLE_CODES } = require("../utils/role.utils");

// Cấu hình lưu trữ file PDF vào thư mục client/public/pdf
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../client/public/pdf"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "BoSung-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Chỉ cho phép tải lên file PDF"), false);
    }
  }
});

router.get("/phe-duyet/ke-hoach", authorize([ROLE_CODES.QUAN_LY]), pheDuyetController.getAllKeHoachPheDuyet);
router.get("/phe-duyet/ke-hoach/search", authorize([ROLE_CODES.QUAN_LY]), pheDuyetController.searchKeHoachPheDuyet);
router.get("/phe-duyet/ke-hoach/:maKeHoach", authorize([ROLE_CODES.QUAN_LY]), pheDuyetController.getKeHoachChiTiet);
router.put(
  "/phe-duyet/ke-hoach/:maKeHoach/trang-thai", 
  authorize([ROLE_CODES.QUAN_LY]),
  upload.single("filePDFBoSungKeHoach"),
  pheDuyetController.updateTrangThaiPheDuyet
);

// Gỡ file đơn lẻ ngay lập tức
router.delete("/phe-duyet/ke-hoach/:maKeHoach/file/:fileKey", authorize([ROLE_CODES.QUAN_LY]), pheDuyetController.removeSpecificFile);

module.exports = router;
