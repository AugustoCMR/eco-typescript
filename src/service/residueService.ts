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

    async updateResidue(id: number, residue: Residue)
    {
        await residueRepository.save
        (
            {
                ...residue,
                id
            }
        )
    }

    async deleteResidue(id: number)
    {
        await residueRepository.delete(id);
    }
    
}