import { AppDataSource } from "../data-source";
import { BadRequestError } from "../helpers/api-erros";
import { customerRepository } from "../repositories/customerRepository";
import { receivedMaterialRepository } from "../repositories/receivedMaterialRepository";
import { CodeGenerator } from "../utils/codeGenerator";
import { checkPassword, generateHash } from "../utils/hash";
import { generateToken } from "../utils/token";
import { validateDelete, validateIdParam } from "../utils/validations";
import { customerSchema } from "../validators/customerValidator";
import { idSchema } from "../validators/idValidator";

export class CustomerService 
{
    async createCustomer(customer: customerSchema)
    {
        await this.validateCPFAndEmail(customer.cpf, customer.email);

        customer.codigo = await new CodeGenerator().generateCode("customer");

        customer.senha = await generateHash(customer.senha);

        const newCustomer = customerRepository.create(customer);
        await customerRepository.save(newCustomer);
    }

    async updateCustomer(code: number, customer: customerSchema)
    {
        await validateIdParam(customerRepository, "usuário", code);

        await customerRepository.update
        (   
            {codigo: code},
            {
                ...customer
            }   
        );
    }

    async deleteCustomer(code: number)
    {
        const customer = await validateIdParam(customerRepository, "usuário", code);

        await validateDelete(receivedMaterialRepository, {customer: customer}, "usuário");

        await customerRepository.delete({ codigo: code });
    }

    async getCustomerById(code: string)
    {   
        const idValidated = parseInt(idSchema.parse(code));

        const findCustomer = await validateIdParam(customerRepository, "usuário", idValidated);

        const {senha, ...customer} = findCustomer;

        return customer;
    }

    async login(email: string, password: string)
    {
        const customer = await customerRepository.findOneBy({ email: email });

        if(!customer)
        {
            throw new BadRequestError("Credenciais inválidas");
        }

        const isPasswordValid = await checkPassword(password, customer.senha);

        if(!isPasswordValid)
        {
            throw new BadRequestError("Credenciais inválidas");
        }

        return generateToken({ customerId: customer.id, email: customer.email });
    }

    async extract(code: string)
    {
        const validatedData = idSchema.parse(code);
        
        await validateIdParam(customerRepository, "usuário", parseInt(validatedData));

        return await AppDataSource.query(`
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
    }

    async validateCPFAndEmail(cpf: string, email: string)
    {
        const checkCPF = await customerRepository.findOneBy({ cpf });
        
        if(checkCPF)
        {
            throw new BadRequestError("O CPF informado já possui cadastro");
        }

        const checkEmail = await customerRepository.findOneBy({ email });

        if(checkEmail)
        {
            throw new BadRequestError("O E-mail informado já possuí cadastro");
        }
    }
}
