import { Router } from "express";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import * as orderController from "../controller/orderController";

const userOrderRoutes = Router();

userOrderRoutes.post("/create", authMiddleware as any, asyncHandler(orderController.createOrder));

userOrderRoutes.get("/my-orders", authMiddleware as any, asyncHandler(orderController.getMyOrders));

userOrderRoutes.get("/:orderId", authMiddleware as any, asyncHandler(orderController.getOrderById));

export default userOrderRoutes;
