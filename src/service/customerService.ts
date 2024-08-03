import { Customer } from "../models/customerModel";
import { customerRepository } from "../repositories/customerRepository";

export class CustomerService 
{

    async createCustomer(customer: Customer) 
    {
        customer.codigo = 1;
        const newCustomer = customerRepository.create(customer);
        await customerRepository.save(newCustomer);
    }

    async updateCustomer(id: number, customer: Customer) 
    {
      await customerRepository.save({
        ...customer,
        id,
      });
    }

    async deleteCustomer(id: number) 
    {
      await customerRepository.delete({ codigo: id });
    }
}
