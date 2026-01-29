import { Router } from "express";

import { getActiveStoreBranding } from "../controller/storeBrandingController";

const router = Router();

router.get("/", getActiveStoreBranding);

export default router;
