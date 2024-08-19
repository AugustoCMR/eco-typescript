import { Residue } from "../models/residueModel";
import { materialRepository } from "../repositories/materialRepository";
import { residueRepository } from "../repositories/residueRepository";
import { CodeGenerator } from "../utils/codeGenerator";
import { validateDelete, validateEntityName, validateIdParam } from "../utils/validations";
import { idSchema } from "../validators/idValidator";
import { residueSchema } from "../validators/residueValidator";

export class ResidueService
{
    async createResidue(residue: Residue)
    {   
        const validatedData = residueSchema.parse(residue);
        await validateEntityName(residueRepository, 'Resíduo', validatedData.nome, 'nome');

        let code: number = await new CodeGenerator().generateCode("residue");

        validatedData.codigo = code;
        const newResidue = residueRepository.create(validatedData);
        await residueRepository.save(newResidue);
    }

    async updateResidue(code: string, residue: Residue)
    {
        const idValidated = parseInt(idSchema.parse(code));

        await validateIdParam(residueRepository, "resíduo", idValidated);

        const validatedData  = residueSchema.parse(residue);

        await residueRepository.update
        (
            {codigo: idValidated},
            {
                ...validatedData,
                
            }
        )
    }

    async deleteResidue(code: string)
    {   
        const idValidated = parseInt(idSchema.parse(code));
        const residue = await validateIdParam(residueRepository, "resíduo", idValidated);

        await validateDelete(materialRepository, {residue: residue}, "resíduo");

        await residueRepository.delete({ codigo: idValidated });
    } 
}   