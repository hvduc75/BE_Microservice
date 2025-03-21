import multer from "multer";

const storage = multer.memoryStorage(); // Lưu ảnh vào bộ nhớ RAM thay vì ổ đĩa

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
