import express from "express";
import { CustomerController } from "../controllers/customerController";
import { validateCPF, validateEmail } from "../middlewares/customerMiddleware";

const router = express.Router();
const customerController = new CustomerController();

router.post("/", validateCPF, validateEmail, customerController.createCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);
router.get("/", customerController.getAllCustomers);
router.get("/extrato/:id", customerController.extract);
router.get("/:id", customerController.getCustomerById);

export default router;
