import express from "express";
import { MaterialController } from "../controllers/materialController";
import { validateName } from "../middlewares/materialMiddleware";
import { materialRepository } from "../repositories/materialRepository";
import { validateIdBody, validateIdParam } from "../middlewares/abstractMiddleware";
import { residueRepository } from "../repositories/residueRepository";

const router = express.Router();
const materialController = new MaterialController();

router.post("/", validateName, validateIdBody(residueRepository, 'material', 'residue', 'O ID do resíduo informado não existe'), materialController.createMaterial);
router.put("/:id",validateIdParam(materialRepository, "O ID do material informado não existe"),materialController.updateMaterial);
router.delete("/:id",validateIdParam(materialRepository, "O ID do material informado não existe"),materialController.deleteMaterial);
router.get("/", materialController.getAllMaterials);
router.get("/consulta", materialController.detailedMaterialFetch);
router.get("/:id",validateIdParam(materialRepository, "O ID do material informado não existe"),materialController.getMaterialById);
router.post("/recebidos/", materialController.receivedMaterial);

export default router;
