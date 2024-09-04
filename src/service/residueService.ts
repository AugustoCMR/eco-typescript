import { Residue } from "../models/residueModel";
import { materialRepository } from "../repositories/materialRepository";
import { residueRepository } from "../repositories/residueRepository";
import { CodeGenerator } from "../utils/codeGenerator";
import { validateDelete, validateEntityName, validateIdParam } from "../utils/validations";
import { idSchema } from "../validators/idValidator";
import { residueSchema } from "../validators/residueValidator";

export class ResidueService
{
    async createResidue(residue: residueSchema)
    {
        await validateEntityName(residueRepository, 'Resíduo', residue.nome, 'nome');

        residue.codigo = await new CodeGenerator().generateCode("residue");

        const newResidue = residueRepository.create(residue);
        await residueRepository.save(newResidue);
    }

    async updateResidue(code: number, residue: residueSchema)
    {

        await validateIdParam(residueRepository, "resíduo", code);
        


        await validateEntityName(residueRepository, 'Resíduo', residue.nome, 'nome', code);

        await residueRepository.update
        (
            {codigo: code},
            {
                ...residue,
                
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

    async getResidueById(code: string)
    {
        const idValidated = parseInt(idSchema.parse(code)); 
        await validateIdParam(residueRepository, "resíduo", idValidated);

        const residue = await residueRepository.findOneBy({ codigo: idValidated });

        return residue;
    }
}   