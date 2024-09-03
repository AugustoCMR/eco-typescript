import { QueryRunner } from "typeorm";
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
import { materialSchema } from "../validators/materialValidator";
import {schemaMasterDetail, schemaReceivedMaterial} from "../validators/receivedMaterialValidator";
import {AppDataSource} from "../data-source";
import {Customer} from "../models/customerModel";

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

    async receivedMaterial(object: schemaReceivedMaterial, queryRunner: QueryRunner)
    {   
        const objectMasterDetail = schemaMasterDetail.parse({master: object.master, detail: object.detail});
        
        let idMaterial;
        let material;
        let receivedMaterials: number[] = [];

        const idCustomer = Number(objectMasterDetail.master.customer);

        const customer = await validateIdBody(customerRepository, idCustomer, "Usuário");

        objectMasterDetail.master.codigo = await new CodeGenerator().generateCode("received_material");
        
        const newReceivedMaterial = receivedMaterialRepository.create
        (
           {
                ...objectMasterDetail.master,
                customer
           } 
        );

        const receivedMaterialCreated = await queryRunner.manager.save(newReceivedMaterial);

        let saldoAtual = customer.ecosaldo;

        customer.ecosaldo += Number(receivedMaterialCreated.ecoSaldoTotal);

        await queryRunner.manager.save(customer);

        for(let detail of objectMasterDetail.detail)
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

    async detailedMaterialFetch()
    {
        return await AppDataSource.getRepository(Customer)
            .createQueryBuilder('customer')
            .innerJoinAndSelect('customer.receivedMaterials', 'receivedMaterials')
            .innerJoinAndSelect('receivedMaterials.receivedMaterialsDetail', 'receivedMaterialsDetail')
            .getMany();
    }
}