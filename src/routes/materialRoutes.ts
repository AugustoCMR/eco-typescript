import express from "express";
import { MaterialController } from "../controllers/materialController";

const router = express.Router();
const materialController = new MaterialController();

router.post("/", materialController.createMaterial);

export default router;