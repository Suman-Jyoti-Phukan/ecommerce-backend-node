import { Router } from "express";

import {
  createSizeChart,
  updateSizeChart,
  deleteSizeChart,
  getSizeChartById,
  getAllSizeCharts,
} from "../controller/sizeChartController";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post("/", createSizeChart);

router.get("/", getAllSizeCharts);

router.get("/:sizeChartId", getSizeChartById);

router.put("/:sizeChartId", updateSizeChart);

router.delete("/:sizeChartId", deleteSizeChart);

export default router;
