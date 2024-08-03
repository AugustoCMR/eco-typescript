import { Customer } from "../models/customerModel";
import { customerRepository } from "../repositories/customerRepository";
import { CodeGenerator } from "../utils/codeGenerator";

export class CustomerService 
{

    async createCustomer(customer: Customer) 
    {
        let code: number = await new CodeGenerator().generateCode("customer");

        customer.codigo = code;
        const newCustomer = customerRepository.create(customer);
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
