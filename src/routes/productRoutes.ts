import express from "express";
import { ProductController } from "../controllers/productController";
import { validateName } from "../middlewares/productMiddleware";
import { validateIdParam } from "../middlewares/abstractMiddleware";
import { productRepository } from "../repositories/productRepository";

const router = express.Router();
const productController = new ProductController();

router.post("/", validateName, productController.createProduct);
router.put("/:id", validateIdParam(productRepository, "O ID do produto informado não existe"),productController.updateProduct);
router.delete("/:id", validateIdParam(productRepository, "O ID do produto informado não existe"), productController.deleteProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", validateIdParam(productRepository, "O ID do produto informado não existe"),productController.getProductById);
router.post("/entrada", productController.insertProductOperation);
router.post("/saida", productController.removeProductOperation);

export default router;
