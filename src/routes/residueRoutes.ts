import express from "express";
import { ResidueController } from "../controllers/residueController";
import { residueRepository } from "../repositories/residueRepository";
import { validateIdParam } from "../middlewares/abstractMiddleware";

const router = express.Router();
const residueController = new ResidueController();

router.post("/", residueController.createResidue);
router.put("/:id", residueController.updateResidue);
router.delete("/:id", residueController.deleteResidue);
router.get("/", residueController.getAllResidues);
router.get("/:id",validateIdParam(residueRepository, "O ID do resíduo informado não existe"),residueController.getResidueById);

export default router;
