import { Material } from "../models/materialModel";
import { ReceivedMaterialDetail } from "../models/receivedMaterialDetailModel";
import { ReceivedMaterial } from "../models/receivedMaterialModel";
import { customerRepository } from "../repositories/customerRepository";
import { materialRepository } from "../repositories/materialRepository";
import { receivedMaterialDetailRepository } from "../repositories/receivedMaterialDetailRepository";
import { receivedMaterialRepository } from "../repositories/receivedMaterialRepository";
import { residueRepository } from "../repositories/residueRepository";
import { CodeGenerator } from "../utils/codeGenerator";
import { validateDelete, validateEntityName, validateIdBody, validateIdParam} from "../utils/validations";
import { idSchema } from "../validators/idValidator";
import { materialSchema } from "../validators/materialValidator";
import { schemaMasterDetail} from "../validators/receivedMaterialValidator";

export class MaterialService
{
    async createMaterial(material: Material)
    {
        const validatedData = materialSchema.parse(material);
        await validateEntityName(materialRepository, 'Material', validatedData.nome, 'nome');
        const residue = await validateIdBody(residueRepository, validatedData.residue, "Resíduo");

        let code: number = await new CodeGenerator().generateCode("material");

        validatedData.codigo = code;

        const newMaterial = materialRepository.create
        (   
            {
                ...validatedData,
                residue: residue   
            }  
        );   

        await materialRepository.save(newMaterial); 
    }

    async updateMaterial(code: string, material: Material)
    {   
        
        const idValidated = parseInt(idSchema.parse(code));
        
        await validateIdParam(materialRepository, "material", idValidated);
       
        const validatedData = materialSchema.parse(material);

        await validateEntityName(materialRepository, 'Material', validatedData.nome, 'nome'), idValidated;

        const residue = await validateIdBody(residueRepository, validatedData.residue, "Resíduo");
        
        await materialRepository.update
        (
            {codigo: idValidated},
            {
                ...validatedData,
                residue
            }
        )
    }

    async deleteMaterial(code: string)
    {   
        const idValidated = parseInt(idSchema.parse(code));
        const material = await validateIdParam(materialRepository, "material", idValidated);

        await validateDelete(receivedMaterialDetailRepository, {material: material}, "material");

        await materialRepository.delete({ codigo: idValidated });
      
    }

    async getMaterialById (code: string)
    {   
        const idValidated = parseInt(idSchema.parse(code));

        const material = await validateIdParam(materialRepository, "material", idValidated);

        return material;
    }

    async receivedMaterial(bodyMaster: ReceivedMaterial, bodyDetail: ReceivedMaterialDetail[])
    {   
     
        const validatedData = schemaMasterDetail.parse({master: bodyMaster, detail: bodyDetail});
        
        let idMaterial;
        let material;

        const idCustomer = Number(validatedData.master.customer);

        const customer = await validateIdBody(customerRepository, idCustomer, "Usuário");

        let code: number = await new CodeGenerator().generateCode("received_material");

        validatedData.master.codigo = code;
        
        const newReceivedMaterial = receivedMaterialRepository.create
        (
           {
                ...validatedData.master,
                customer
           } 
        );

        const receivedMaterialCreated = await receivedMaterialRepository.save(newReceivedMaterial);

        let saldoAtual = 0;

        saldoAtual = customer.ecosaldo;

        customer.ecosaldo += Number(receivedMaterialCreated.ecoSaldoTotal);

        await customerRepository.save(customer);

        const savePromises = validatedData.detail.map(async detail => 
        {   
            idMaterial = Number(detail.material);

            material = await validateIdBody(materialRepository, idMaterial, "Material");

            material.quantidade += detail.quantidade;
            await materialRepository.save(material);

            saldoAtual += detail.subtotal;
            detail.saldoAtualCustomer = saldoAtual;

            detail.receivedMaterial = receivedMaterialCreated;
            return receivedMaterialDetailRepository.save({...detail, material});
        });
    
        await Promise.all(savePromises);
    }
}