import express from "express";
import { ProductController } from "../controllers/productController";

const router = express.Router();
const productController = new ProductController();

router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/entrada", productController.insertProductOperation);
router.post("/saida", productController.removeProductOperation);

export default router;