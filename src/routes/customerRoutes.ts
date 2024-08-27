import express from "express";
import { CustomerController } from "../controllers/customerController";
import { validateIdParam } from "../middlewares/abstractMiddleware";
import { customerRepository } from "../repositories/customerRepository";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const customerController = new CustomerController();

router.post("/", customerController.createCustomer);
router.put("/:id", authMiddleware, customerController.updateCustomer);
router.delete("/:id", authMiddleware, customerController.deleteCustomer);
router.get("/", authMiddleware, customerController.getAllCustomers);
router.post("/login", customerController.login);
router.get("/extrato/:id", authMiddleware, customerController.extract);
router.get("/:id", authMiddleware, customerController.getCustomerById);

export default router;
