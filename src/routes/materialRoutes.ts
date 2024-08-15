import express from "express";
import { MaterialController } from "../controllers/materialController";
import { validateName } from "../middlewares/materialMiddleware";

const router = express.Router();
const materialController = new MaterialController();

router.post("/", validateName, materialController.createMaterial);
router.put("/:id", materialController.updateMaterial);
router.delete("/:id", materialController.deleteMaterial);
router.get("/", materialController.getAllMaterials);
router.get("/consulta", materialController.detailedMaterialFetch);
router.get("/:id", materialController.getMaterialById);
router.post("/recebidos/", materialController.receivedMaterial);

export default router;
