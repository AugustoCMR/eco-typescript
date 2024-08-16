import { Material } from "../models/materialModel";
import { ReceivedMaterialDetail } from "../models/receivedMaterialDetailModel";
import { ReceivedMaterial } from "../models/receivedMaterialModel";
import { customerRepository } from "../repositories/customerRepository";
import { materialRepository } from "../repositories/materialRepository";
import { receivedMaterialDetailRepository } from "../repositories/receivedMaterialDetailRepository";
import { receivedMaterialRepository } from "../repositories/receivedMaterialRepository";
import { residueRepository } from "../repositories/residueRepository";
import { CodeGenerator } from "../utils/codeGenerator";
import { materialSchema } from "../validators/materialValidator";

export class MaterialService
{
    async createMaterial(material: Material)
    {
        let code: number = await new CodeGenerator().generateCode("material");

        const validatedData = materialSchema.parse(material);

        validatedData.codigo = code;

        const residue = await residueRepository.findOneBy({id: validatedData.residue});

        if (!residue) {
            throw new Error("Resíduo não encontrado");
        }

        const newMaterial = materialRepository.create
        (   
            {
                ...validatedData,
                residue: residue   
            }  
        );   

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

        const customer = await customerRepository.findOneBy({codigo: receivedMaterialCreated.customer.id});

        let saldoAtual = 0;

        if(customer)
        {   

            saldoAtual = customer.ecosaldo;

            customer.ecosaldo += Number(receivedMaterialCreated.ecoSaldoTotal);

            await customerRepository.save(customer);
        }

        console.log('salod atual:  ' + saldoAtual);


        const savePromises = receivedMaterialsDetail.map(detail => 
        {

            saldoAtual += detail.subtotal;
            detail.saldoAtualCustomer = saldoAtual;

            detail.receivedMaterial = receivedMaterialCreated;
            return receivedMaterialDetailRepository.save(detail);
        });
    
        await Promise.all(savePromises);
    }
}