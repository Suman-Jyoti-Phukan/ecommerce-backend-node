import { Router } from "express";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import { asyncHandler } from "../middleware/errorHandler";

import * as orderController from "../controller/orderController";

const adminOrderRoutes = Router();

adminOrderRoutes.get("/all", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(orderController.getAllOrders));

adminOrderRoutes.get("/:orderId", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(orderController.getAdminOrderById));

adminOrderRoutes.put("/:orderId/status", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(orderController.updateOrderStatus));

export default adminOrderRoutes;
