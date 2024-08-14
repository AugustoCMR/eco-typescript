import { Residue } from "../models/residueModel";
import { residueRepository } from "../repositories/residueRepository";
import { CodeGenerator } from "../utils/codeGenerator";
import { residueSchema } from "../validators/residueValidator";

export class ResidueService
{
    async createResidue(residue: Residue)
    {   
        let code: number = await new CodeGenerator().generateCode("residue");

        const validatedData = residueSchema.parse(residue);

        validatedData.codigo = code;
        const newResidue = residueRepository.create(validatedData);
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