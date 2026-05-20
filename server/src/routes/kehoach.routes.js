const express = require("express");
const router = express.Router();
const keHoachController = require("../controllers/kehoach.controller");
const { authorize } = require("../middlewares/auth.middleware");
const { ROLE_CODES } = require("../utils/role.utils");
const { uploadPdf } = require("../utils/pdfUpload.utils");

const uploadPlanFiles = uploadPdf.fields([
  { name: "fileKeHoach", maxCount: 1 },
  { name: "fileDeNghiCapPhep", maxCount: 1 },
  { name: "fileBoSungKeHoach", maxCount: 1 },
]);

const handleUploadPlanFiles = (req, res, next) => {
  uploadPlanFiles(req, res, (error) => {
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

router.get("/ke-hoach", keHoachController.searchKeHoach);
router.get("/ke-hoach/stats", keHoachController.getKeHoachStats);
router.get(
  "/ke-hoach/cua-toi",
  authorize([ROLE_CODES.KY_THUAT]),
  keHoachController.getKeHoachCuaToi
);
router.get("/ke-hoach/:maKeHoach", keHoachController.getKeHoachByMa);
router.post(
  "/ke-hoach",
  authorize([ROLE_CODES.KY_THUAT]),
  handleUploadPlanFiles,
  keHoachController.createKeHoach
);
router.put(
  "/ke-hoach/:maKeHoach",
  authorize([ROLE_CODES.KY_THUAT]),
  handleUploadPlanFiles,
  keHoachController.updateKeHoach
);
router.patch(
  "/ke-hoach/:maKeHoach/huy",
  authorize([ROLE_CODES.KY_THUAT]),
  keHoachController.huyKeHoach
);

module.exports = router;
