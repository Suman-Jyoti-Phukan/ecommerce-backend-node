import { Router } from "express";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import { asyncHandler } from "../middleware/errorHandler";

import * as shipRocketController from "../controller/shipRocketController";

const adminShipRocketRoutes = Router();

adminShipRocketRoutes.post("/", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(shipRocketController.createShipRocketOrder));

adminShipRocketRoutes.get("/all", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(shipRocketController.getAllShipRocketOrders));

adminShipRocketRoutes.get("/pickup-locations", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(shipRocketController.getPickupLocations));

adminShipRocketRoutes.get("/:id", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(shipRocketController.getShipRocketOrderById));

adminShipRocketRoutes.get("/:shipmentId/track", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(shipRocketController.getShipRocketOrderTracking));

export default adminShipRocketRoutes;
