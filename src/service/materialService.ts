import { QueryRunner } from "typeorm";
import { Material } from "../models/materialModel";
import { ReceivedMaterialDetail } from "../models/receivedMaterialDetailModel";
import { ReceivedMaterial } from "../models/receivedMaterialModel";
import { customerRepository } from "../repositories/customerRepository";
import { materialRepository } from "../repositories/materialRepository";
import { receivedMaterialDetailRepository } from "../repositories/receivedMaterialDetailRepository";
import { receivedMaterialRepository } from "../repositories/receivedMaterialRepository";
import { residueRepository } from "../repositories/residueRepository";
import { CodeGenerator } from "../utils/codeGenerator";
import {
    validateDelete,
    validateEntityName,
    validateIdBody,
    validateIdParam,
    validateRepeatedItem
} from "../utils/validations";
import { idSchema } from "../validators/idValidator";
import { materialSchema } from "../validators/materialValidator";
import { schemaMasterDetail} from "../validators/receivedMaterialValidator";

export class MaterialService
{
    async createMaterial(material: materialSchema)
    {
        await validateEntityName(materialRepository, 'Material', material.nome, 'nome');
        const residue = await validateIdBody(residueRepository, material.residue, "Resíduo");

        material.codigo = await new CodeGenerator().generateCode("material");

        const newMaterial = materialRepository.create
        (   
            {
                ...material,
                residue: residue   
            }  
        );   

        await materialRepository.save(newMaterial); 
    }

    async updateMaterial(code: number, material: materialSchema)
    {
        await validateIdParam(materialRepository, "material", code);

        await validateEntityName(materialRepository, 'Material', material.nome, 'nome', code);

        const residue = await validateIdBody(residueRepository, material.residue, "Resíduo");
        
        await materialRepository.update
        (
            {codigo: code},
            {
                ...material,
                residue
            }
        )
    }

    async deleteMaterial(code: number)
    {   
        const material = await validateIdParam(materialRepository, "material", code);

        await validateDelete(receivedMaterialDetailRepository, {material: material}, "material");

        await materialRepository.delete({ codigo: code });
    }

    async getMaterialById (code: number)
    {   

        return await validateIdParam(materialRepository, "material", code);
    }

    async receivedMaterial(bodyMaster: ReceivedMaterial, bodyDetail: ReceivedMaterialDetail[], queryRunner: QueryRunner)
    {   
     
        const validatedData = schemaMasterDetail.parse({master: bodyMaster, detail: bodyDetail});
        
        let idMaterial;
        let material;
        let receivedMaterials: number[] = [];

        const idCustomer = Number(validatedData.master.customer);

        const customer = await validateIdBody(customerRepository, idCustomer, "Usuário");

        validatedData.master.codigo = await new CodeGenerator().generateCode("received_material");
        
        const newReceivedMaterial = receivedMaterialRepository.create
        (
           {
                ...validatedData.master,
                customer
           } 
        );

        const receivedMaterialCreated = await queryRunner.manager.save(newReceivedMaterial);

        let saldoAtual = customer.ecosaldo;

        customer.ecosaldo += Number(receivedMaterialCreated.ecoSaldoTotal);

        await queryRunner.manager.save(customer);

        for(let detail of validatedData.detail)
        {
            idMaterial = Number(detail.material);

            await validateRepeatedItem(receivedMaterials, idMaterial);

            receivedMaterials.push(idMaterial);

            material = await validateIdBody(materialRepository, idMaterial, "Material");

            material.quantidade += detail.quantidade;
            await queryRunner.manager.save(material);

            saldoAtual += detail.subtotal;
            detail.saldoAtualCustomer = saldoAtual;

            detail.receivedMaterial = receivedMaterialCreated;
            const receivedMaterialDetailEntity = receivedMaterialDetailRepository.create(
                {
                    ...detail,
                    material
                });

            await queryRunner.manager.save(receivedMaterialDetailEntity);
        }

        await queryRunner.commitTransaction()
    }
}