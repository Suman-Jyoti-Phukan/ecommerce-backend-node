import { Router } from "express";

import {
  createColorScheme,
  updateColorScheme,
  deleteColorScheme,
} from "../controller/colorController";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post("/", createColorScheme);

router.put("/:colorSchemeId", updateColorScheme);

router.delete("/:colorSchemeId", deleteColorScheme);

export default router;
