import express from 'express';
import { ResidueController } from '../controllers/residueController';

const router = express.Router();
const residueController = new ResidueController();

router.post('/', residueController.createResidue);
router.put('/:id', residueController.updateResidue);
router.delete('/:id', residueController.deleteResidue);

export default router;