import express from "express";
import { ProductController } from "../controllers/productController";
import { validateName } from "../middlewares/productMiddleware";
import { validateIdBody, validateIdDetail, validateIdParam } from "../middlewares/abstractMiddleware";
import { productRepository } from "../repositories/productRepository";
import { customerRepository } from "../repositories/customerRepository";

const router = express.Router();
const productController = new ProductController();

router.post("/", validateName, productController.createProduct);
router.put("/:id", validateIdParam(productRepository, "O ID do produto informado não existe"),productController.updateProduct);
router.delete("/:id", validateIdParam(productRepository, "O ID do produto informado não existe"), productController.deleteProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", validateIdParam(productRepository, "O ID do produto informado não existe"),productController.getProductById);
router.post("/entrada", validateIdDetail(productRepository, 'produtos', 'produto', 'O ID do produto informado não existe'), productController.insertProductOperation);
router.post("/saida", validateIdBody(customerRepository, 'mestre', 'usuario', "O ID do usuário informado não existe"), validateIdDetail(productRepository, 'detalhe', 'produto', 'O ID do produto informado não existe'), productController.removeProductOperation);

export default router;
