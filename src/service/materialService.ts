import { Material } from "../models/materialModel";
import { materialRepository } from "../repositories/materialRepository";
import { CodeGenerator } from "../utils/codeGenerator";

export class MaterialService
{
    async createMaterial(material: Material)
    {
        let code: number = await new CodeGenerator().generateCode("material");

        material.codigo = code;
        const newMaterial = materialRepository.create(material);
        await materialRepository.save(newMaterial);
    }

    async updateMaterial(code: number, material: Material)
    {
        await materialRepository.update
        (
            {codigo: code},
            {
                ...material
            }
        )
    }
}