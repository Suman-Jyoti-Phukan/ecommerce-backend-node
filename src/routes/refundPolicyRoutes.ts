import { Router } from "express";

import { getActiveRefundPolicy } from "../controller/refundPolicyController";

const router = Router();

router.get("/", getActiveRefundPolicy);

export default router;
