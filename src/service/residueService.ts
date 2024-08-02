import { Residue } from "../models/residueModel";
import { residueRepository } from "../repositories/residueRepository";

export class ResidueService
{
    async createResidue(residue: Residue)
    {
        residue.codigo = 1;
        const newResidue = residueRepository.create(residue);
        await residueRepository.save(newResidue);
    }
}