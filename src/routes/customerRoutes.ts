import express from "express";
import { CustomerController } from "../controllers/customerController";
import { validateCPF, validateEmail } from "../middlewares/customerMiddleware";
import { validateIdParam } from "../middlewares/abstractMiddleware";
import { customerRepository } from "../repositories/customerRepository";

const router = express.Router();
const customerController = new CustomerController();

router.post("/", validateCPF, validateEmail, customerController.createCustomer);
router.put("/:id",validateIdParam(customerRepository, "O ID do usuário informado não existe"),customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);
router.get("/", customerController.getAllCustomers);
router.get("/extrato/:id",validateIdParam(customerRepository, "O ID do usuário informado não existe"),customerController.extract);
router.get("/:id",validateIdParam(customerRepository, "O ID do usuário informado não existe"),customerController.getCustomerById);

export default router;
