import express from 'express';
import { ResidueController } from '../controllers/residueController';

const router = express.Router();
const residueController = new ResidueController();

router.post('/', residueController.createResidue);

export default router;