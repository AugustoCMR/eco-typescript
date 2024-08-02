import express from "express";
import { CustomerController } from "../controllers/customerController";

const router = express.Router();
const customerController = new CustomerController();

router.post("/", customerController.createCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);
router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);

export default router;
