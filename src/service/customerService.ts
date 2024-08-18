import { Customer } from "../models/customerModel";
import { customerRepository } from "../repositories/customerRepository";
import { CodeGenerator } from "../utils/codeGenerator";
import { validateIdParam } from "../utils/validations";
import { customerSchema } from "../validators/customerValidator";

export class CustomerService 
{

    async createCustomer(customer: Customer) 
    {
        const validatedData = customerSchema.parse(customer);

        let code: number = await new CodeGenerator().generateCode("customer");

        validatedData.codigo = code;
        const newCustomer = customerRepository.create(validatedData);
        await customerRepository.save(newCustomer);
    }

    async updateCustomer(code: number, customer: Customer) 
    {
        const validatedData = customerSchema.parse(customer);
        
        await validateIdParam(customerRepository, "usuário", code);

        await customerRepository.update
        (   
            {codigo: code},
            {
                ...validatedData
            }   
        );
    }

    async deleteCustomer(code: number) 
    {
        // validateIdParam(customerRepository, "usuário");
        await customerRepository.delete({ codigo: code });
    }

    async getCustomerById(code: number)
    {
        
        await validateIdParam(customerRepository, "usuário", code);

        const customer = await customerRepository.findOneBy({ codigo: code });

        return customer;
    }

}
