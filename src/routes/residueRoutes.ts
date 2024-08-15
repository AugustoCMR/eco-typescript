import express from "express";
import { ResidueController } from "../controllers/residueController";
import { validateName } from "../middlewares/residueMiddleware";

const router = express.Router();
const residueController = new ResidueController();

router.post("/", validateName, residueController.createResidue);
router.put("/:id", residueController.updateResidue);
router.delete("/:id", residueController.deleteResidue);
router.get("/", residueController.getAllResidues);
router.get("/:id", residueController.getResidueById);

export default router;
