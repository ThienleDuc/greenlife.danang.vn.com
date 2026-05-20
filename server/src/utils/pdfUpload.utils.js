const crypto = require("crypto");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const PDF_DIR = path.join(__dirname, "../../public/pdf");
const MAX_PDF_SIZE = 10 * 1024 * 1024;

const FIELD_PREFIX_MAP = {
  fileKeHoach: "kh",
  fileDeNghiCapPhep: "cp",
  fileBoSungKeHoach: "bs",
  filePDFBoSungKeHoach: "bs",
};

const ensurePdfDir = () => {
  if (!fs.existsSync(PDF_DIR)) {
    fs.mkdirSync(PDF_DIR, { recursive: true });
  }
};

const generateUniquePdfFileName = (prefix = "pdf") => {
  let fileName;

  do {
    fileName = `${prefix}_${crypto.randomBytes(16).toString("hex")}.pdf`;
  } while (fs.existsSync(path.join(PDF_DIR, fileName)));

  return fileName;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensurePdfDir();
    cb(null, PDF_DIR);
  },
  filename: (req, file, cb) => {
    const prefix = FIELD_PREFIX_MAP[file.fieldname] || "pdf";
    cb(null, generateUniquePdfFileName(prefix));
  },
});

const uploadPdf = multer({
  storage,
  limits: {
    fileSize: MAX_PDF_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext !== ".pdf" || file.mimetype !== "application/pdf") {
      return cb(new Error("Chỉ cho phép tải lên file PDF"));
    }

    cb(null, true);
  },
});

const deleteUploadedFiles = (files = {}) => {
  Object.values(files)
    .flat()
    .filter(Boolean)
    .forEach((file) => {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
};

const deletePdfFile = (fileName) => {
  if (!fileName) return;
  const filePath = path.join(PDF_DIR, fileName);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Không thể xóa file ${fileName}:`, err);
    }
  }
};

module.exports = {
  PDF_DIR,
  MAX_PDF_SIZE,
  uploadPdf,
  deleteUploadedFiles,
  deletePdfFile,
};
