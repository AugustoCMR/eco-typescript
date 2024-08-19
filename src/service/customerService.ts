import { AppDataSource } from "../data-source";
import { Customer } from "../models/customerModel";
import { customerRepository } from "../repositories/customerRepository";
import { receivedMaterialRepository } from "../repositories/receivedMaterialRepository";
import { CodeGenerator } from "../utils/codeGenerator";
import { validateIdParam } from "../utils/validations";
import { customerSchema } from "../validators/customerValidator";
import { idSchema } from "../validators/idValidator";

export class CustomerService 
{

    async createCustomer(customer: Customer) 
    {
        const validatedData = customerSchema.parse(customer);

        await this.validateCPFAndEmail(customer.cpf, customer.email);

        let code: number = await new CodeGenerator().generateCode("customer");

        validatedData.codigo = code;
        const newCustomer = customerRepository.create(validatedData);
        await customerRepository.save(newCustomer);
    }

    async updateCustomer(code: string, customer: Customer) 
    {   
        const idValidated = parseInt(idSchema.parse(code));
        await validateIdParam(customerRepository, "usuário", idValidated);

        const validatedData = customerSchema.parse(customer);
        
        await validateIdParam(customerRepository, "usuário", idValidated);

        await customerRepository.update
        (   
            {codigo: idValidated},
            {
                ...validatedData
            }   
        );
    }

    async deleteCustomer(code: string) 
    {   
        const idValidated = parseInt(idSchema.parse(code));

        const customer = await validateIdParam(customerRepository, "usuário", idValidated);

        await this.validateDeleteCustomer(customer);

        await customerRepository.delete({ codigo: idValidated });
    }

    async getCustomerById(code: string)
    {   
        const idValidated = parseInt(idSchema.parse(code));

        await validateIdParam(customerRepository, "usuário", idValidated);
        
        const customer = await customerRepository.findOneBy({ codigo: idValidated });

        return customer;
    }

    async extract(code: string)
    {
        const validatedData = idSchema.parse(code);
        
        await validateIdParam(customerRepository, "usuário", parseInt(validatedData));

        const extract = await AppDataSource.query(`
            SELECT 
                ct.nome, 
                ct.ecosaldo,
                mt.nome AS item,
                rm."ecoSaldoTotal",
                rme.subtotal AS Entrada,
                rme."saldoAtualCustomer",
                NULL AS Saida,  
                rm.created_at
            FROM 
                customer AS ct
            INNER JOIN 
                received_material AS rm ON ct.id = rm."customerId"
            INNER JOIN
                received_material_detail AS rme ON rm.id = rme."receivedMaterialId"
            INNER JOIN
                material AS mt ON mt.id = rme."materialId"
            WHERE
                ct.codigo = $1

            UNION ALL

            SELECT 
                ct.nome, 
                ct.ecosaldo,
                pd.nome AS item,
                rpo."ecoSaldoTotal",
                NULL AS Entrada,  
                rpod.subtotal AS Saida,
                rpod."saldoAtualCustomer",
                rpo.created_at
            FROM 
                customer AS ct
            INNER JOIN 
                remove_product_operation AS rpo ON ct.id = rpo."usuarioId"
            INNER JOIN
                remove_product_operation_detail AS rpod ON rpo.id = rpod."removeProductOperationId"
            INNER JOIN
                product AS pd ON rpod."produtoId" = pd.id
            WHERE 
                ct.codigo = $1

            ORDER BY 
                created_at DESC;
        `, [code]);

        return extract;
    }

    async validateCPFAndEmail(cpf: string, email: string)
    {
        const checkCPF = await customerRepository.findOneBy({ cpf });
        
        if(checkCPF)
        {
            throw new Error("O CPF informado já possui cadastro");
        }

        const checkEmail = await customerRepository.findOneBy({ email });

        if(checkEmail)
        {
            throw new Error("O E-mail informado já possuí cadastro");
        }
    }

    async validateDeleteCustomer(customer: Customer)
    {   
        
        const checkCustomer = await receivedMaterialRepository.findOneBy({customer});

        if(checkCustomer)
        {
            throw new Error("Não é possível deletar um usuário que possui registros.");
        }
    }
}
