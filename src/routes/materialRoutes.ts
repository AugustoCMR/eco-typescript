import express from "express";
import { MaterialController } from "../controllers/materialController";

const router = express.Router();
const materialController = new MaterialController();

router.post("/", materialController.createMaterial);
router.put("/:id", materialController.updateMaterial);
router.get("/", materialController.getAllMaterials);

export default router;