import { Router } from "express";

import { getActivePrivacyPolicy } from "../controller/privacyPolicyController";

const router = Router();

router.get("/", getActivePrivacyPolicy);

export default router;
