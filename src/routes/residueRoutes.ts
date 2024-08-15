import express from "express";
import { ResidueController } from "../controllers/residueController";
import { validateName } from "../middlewares/residueMiddleware";
import { residueRepository } from "../repositories/residueRepository";
import { validateIdParam } from "../middlewares/abstractMiddleware";

const router = express.Router();
const residueController = new ResidueController();

router.post("/", validateName, residueController.createResidue);
router.put("/:id",validateIdParam(residueRepository, "O ID do resíduo informado não existe"),residueController.updateResidue);
router.delete("/:id",validateIdParam(residueRepository, "O ID do resíduo informado não existe"),residueController.deleteResidue);
router.get("/", residueController.getAllResidues);
router.get("/:id",validateIdParam(residueRepository, "O ID do resíduo informado não existe"),residueController.getResidueById);

export default router;
