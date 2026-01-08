
import { Request, Response } from "express";

import { productService } from "../service/productService";

import { CustomError } from "../middleware/errorHandler";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    throw error;
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = {
      categoryId: req.query.categoryId as string,
      isFeatured: req.query.isFeatured === 'true',
      isBestSelling: req.query.isBestSelling === 'true',
      isNewCollection: req.query.isNewCollection === 'true',
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
    };

    const result = await productService.getAllProducts(page, limit, filters);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      throw new CustomError("Product not found", 404);
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    throw error;
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates)) {
       throw new CustomError("Updates must be an array", 400);
    }
    const result = await productService.updateInventory(updates);
    res.status(200).json({ success: true, message: "Inventory updated", data: result });
  } catch (error) {
    throw error;
  }
};
