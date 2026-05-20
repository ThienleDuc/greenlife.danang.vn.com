const express = require("express");
const router = express.Router();
const pheDuyetController = require("../controllers/pheduyet.controller");
const { authorize } = require("../middlewares/auth.middleware");
const { ROLE_CODES } = require("../utils/role.utils");
const { uploadPdf } = require("../utils/pdfUpload.utils");

const uploadBoSungFile = uploadPdf.single("filePDFBoSungKeHoach");

const handleUploadBoSungFile = (req, res, next) => {
  uploadBoSungFile(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Dung lượng file vượt quá giới hạn 10MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Không thể lưu file kế hoạch, vui lòng thử lại",
    });
  });
};

router.get("/phe-duyet/ke-hoach", authorize([ROLE_CODES.QUAN_LY]), pheDuyetController.getAllKeHoachPheDuyet);
router.get("/phe-duyet/ke-hoach/search", authorize([ROLE_CODES.QUAN_LY]), pheDuyetController.searchKeHoachPheDuyet);
router.get("/phe-duyet/ke-hoach/:maKeHoach", authorize([ROLE_CODES.QUAN_LY]), pheDuyetController.getKeHoachChiTiet);
router.put(
  "/phe-duyet/ke-hoach/:maKeHoach/trang-thai", 
  authorize([ROLE_CODES.QUAN_LY]),
  handleUploadBoSungFile,
  pheDuyetController.updateTrangThaiPheDuyet
);

// Gỡ file đơn lẻ ngay lập tức
router.delete("/phe-duyet/ke-hoach/:maKeHoach/file/:fileKey", authorize([ROLE_CODES.QUAN_LY]), pheDuyetController.removeSpecificFile);

module.exports = router;
