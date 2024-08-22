import express from "express";
import { ProductController } from "../controllers/productController";
import { validateName } from "../middlewares/productMiddleware";
import { validateIdBody, validateIdDetail, validateIdParam } from "../middlewares/abstractMiddleware";
import { productRepository } from "../repositories/productRepository";
import { customerRepository } from "../repositories/customerRepository";

const router = express.Router();
const productController = new ProductController();

router.post("/", productController.createProduct);
router.put("/:id",productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/entrada", productController.insertProductOperation);
router.post("/saida", productController.removeProductOperation);

export default router;
