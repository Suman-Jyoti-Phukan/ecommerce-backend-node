import { Router } from "express";
import { searchCategoriesAndProducts } from "../controller/searchController";

const router = Router();

router.get("/", searchCategoriesAndProducts);

export default router;
