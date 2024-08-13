import { Customer } from "../models/customerModel";
import { customerRepository } from "../repositories/customerRepository";
import { CodeGenerator } from "../utils/codeGenerator";
import { customerSchema } from "../validators/customerValidator";

export class CustomerService 
{

    async createCustomer(customer: Customer) 
    {
        let code: number = await new CodeGenerator().generateCode("customer");

        const validatedData = customerSchema.parse(customer);

        validatedData.codigo = code;
        const newCustomer = customerRepository.create(validatedData);
        await customerRepository.save(newCustomer);
    }

    async updateCustomer(code: number, customer: Customer) 
    {
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
        await customerRepository.delete({ codigo: code });
    }

}
