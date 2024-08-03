import { Residue } from "../models/residueModel";
import { residueRepository } from "../repositories/residueRepository";
import { CodeGenerator } from "../utils/codeGenerator";

export class ResidueService
{
    async createResidue(residue: Residue)
    {   
        let code: number = await new CodeGenerator().generateCode("residue");

        residue.codigo = code;
        const newResidue = residueRepository.create(residue);
        await residueRepository.save(newResidue);
    }

    async updateResidue(code: number, residue: Residue)
    {
        await residueRepository.update
        (
            {codigo: code},
            {
                ...residue,
                
            }
        )
    }

    async deleteResidue(code: number)
    {
        await residueRepository.delete({ codigo: code });
    }
    
}   