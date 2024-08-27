import express from "express";
import { CustomerController } from "../controllers/customerController";
import { validateIdParam } from "../middlewares/abstractMiddleware";
import { customerRepository } from "../repositories/customerRepository";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const customerController = new CustomerController();

router.post("/", customerController.createCustomer);
router.post("/login", customerController.login);

router.use(authMiddleware);

router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);
router.get("/", customerController.getAllCustomers);
router.get("/extrato/:id", customerController.extract); 
router.get("/:id", customerController.getCustomerById);

export default router;
