import express from "express";
import { MaterialController } from "../controllers/materialController";
import { validateName } from "../middlewares/materialMiddleware";
import { materialRepository } from "../repositories/materialRepository";
import { validateIdBody, validateIdParam, validateIdDetail } from "../middlewares/abstractMiddleware";
import { residueRepository } from "../repositories/residueRepository";
import { customerRepository } from "../repositories/customerRepository";

const router = express.Router();
const materialController = new MaterialController();

router.post("/", materialController.createMaterial);
router.put("/:id", materialController.updateMaterial);
router.delete("/:id", materialController.deleteMaterial);
router.get("/", materialController.getAllMaterials);
router.get("/consulta", materialController.detailedMaterialFetch);
router.get("/:id", materialController.getMaterialById);
router.post("/recebidos/", materialController.receivedMaterial);

export default router;
