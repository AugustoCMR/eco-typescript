import { Request, Response } from "express";
import { customerRepository } from "../repositories/customerRepository"
import { CustomerService } from "../service/customerService";

export class CustomerController 
{
    private customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
    }

    createCustomer = async (req: Request, res: Response) => {
        try 
        {
        await this.customerService.createCustomer(req.body);

        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

        } 
        catch (error) 
        {
        console.error("Erro ao criar cliente:", error);
        res.status(400).json({ error: error });
        }
    };

    updateCustomer = async (req: Request, res: Response) => {
        try 
        {
            const code = parseInt(req.params.id);
            await this.customerService.updateCustomer(code, req.body);

            res.status(201).json({ message: "Usuário atualizado com sucesso!" });

        } 
        catch (error) 
        {
            console.error("Erro ao atualizar cliente:", error);
            res.status(400).json({ error: error });
        }
    };

    deleteCustomer = async (req: Request, res: Response) => {
        try 
        {
        const code = parseInt(req.params.id);
        await this.customerService.deleteCustomer(code);

        res.status(204).send();
        } 
        catch (error) 
        {
        console.error("Erro ao deletar cliente:", error);
        res.status(400).json({ error: error });
        }
    };

    async getAllCustomers(req: Request, res: Response) {
        try 
        {
        const customers = await customerRepository.find();

        res.json(customers);
        } 
        catch (error) 
        {
        console.error("Erro ao buscar clientes:", error);
        res.status(500).json({ error: error });
        }
    }
    async getCustomerById(req: Request, res: Response) {
        try 
        {
            const code = parseInt(req.params.id);
            const customer = await customerRepository.findOneBy({ codigo: code });

            if (customer) {
                res.json(customer);
            } else {
                res.status(404).json({ message: "Usuário não encontrado" });
            }
        } 
        catch (error) 
        {
            console.error("Erro ao buscar cliente:", error);
            res.status(500).json({ error: error });
        }
    }
}
