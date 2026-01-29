import { Router } from "express";

import {
  initiateReturn,
  getUserReturns,
  getReturnDetails,
  cancelReturn,
} from "../controller/returnController";

import { authMiddleware } from "../middleware/auth";

import { createReturnValidation } from "../validators/returnValidator";

import { validate } from "../middleware/validation";

import multer from "multer";

import path from "path";

const FILE_SIZE = 100 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/returns");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "video-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
  // ALLOWED MIMES TYPE
  const allowedMimes = [
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only video files are allowed (mp4, mpeg, mov, avi, mkv, webm)",
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_SIZE,
  },
});

const router = Router();

router.post(
  "/initiate",
  authMiddleware as any,
  upload.single("video"),
  validate(createReturnValidation),
  initiateReturn,
);

router.get("/my-returns", authMiddleware as any, getUserReturns);

router.get("/:returnId", authMiddleware as any, getReturnDetails);

router.post("/:returnId/cancel", authMiddleware as any, cancelReturn);

export default router;
