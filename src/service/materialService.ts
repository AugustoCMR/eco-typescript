import { Material } from "../models/materialModel";
import { ReceivedMaterialDetail } from "../models/receivedMaterialDetailModel";
import { ReceivedMaterial } from "../models/receivedMaterialModel";
import { customerRepository } from "../repositories/customerRepository";
import { materialRepository } from "../repositories/materialRepository";
import { receivedMaterialDetailRepository } from "../repositories/receivedMaterialDetailRepository";
import { receivedMaterialRepository } from "../repositories/receivedMaterialRepository";
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

    async deleteMaterial(code: number)
    {
        await materialRepository.delete({ codigo: code });
      
    }

    async receivedMaterial(receivedMaterial: ReceivedMaterial, receivedMaterialsDetail: ReceivedMaterialDetail[])
    {
        let code: number = await new CodeGenerator().generateCode("received_material");

        receivedMaterial.codigo = code;

        const newReceivedMaterial = receivedMaterialRepository.create(receivedMaterial);
        const receivedMaterialCreated = await receivedMaterialRepository.save(newReceivedMaterial);

        const customer = await customerRepository.findOneBy({id: receivedMaterialCreated.customer.id});

        if(customer)
        {   

            customer.ecosaldo += Number(receivedMaterialCreated.ecoSaldoTotal);

            await customerRepository.save(customer);
        }

        const savePromises = receivedMaterialsDetail.map(detail => 
        {
            detail.receivedMaterial = receivedMaterialCreated;
            return receivedMaterialDetailRepository.save(detail);
        });
    
        await Promise.all(savePromises);
    }
}