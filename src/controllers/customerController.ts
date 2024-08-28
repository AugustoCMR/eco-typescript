import { Request, Response } from "express";
import { customerRepository } from "../repositories/customerRepository"
import { CustomerService } from "../service/customerService";
import { AppDataSource } from "../data-source";
import { Customer } from "../models/customerModel";
import { ZodError } from "zod";

export class CustomerController 
{
    private customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
    }

    createCustomer = async (req: Request, res: Response) => {
        try 
        {
            await this.customerService.createCustomer(req.body.customer);

            res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

        } 
        catch (error) 
        {   
            console.error("Erro ao cadastrar cliente:", error);

            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }
           
        }
    };

    updateCustomer = async (req: Request, res: Response) => {
        try 
        {
            const code = req.params.id;
            await this.customerService.updateCustomer(code, req.body.customer);

            res.status(200).json({ message: "Usuário atualizado com sucesso!" });

        } 
        catch (error) 
        {
            console.error("Erro ao atualizar cliente:", error);
        
            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }
        }
    };

    deleteCustomer = async (req: Request, res: Response) => 
    {
        try 
        {
            const code = req.params.id;
            await this.customerService.deleteCustomer(code);

            res.status(204).send();
        } 
        catch (error) 
        {
            console.error("Erro ao deletar cliente:", error);

            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(400).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }
        }
    };

    async getAllCustomers (req: Request, res: Response) {
        try 
        {
            const findCustomers = await customerRepository.find();
            
            const customers = findCustomers.map(({senha, ...customer}) => customer );

            res.json(customers);
        } 
        catch (error) 
        {
            console.error("Erro ao buscar clientes:", error);

            error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
        }
    }

    getCustomerById = async (req: Request, res: Response) =>
    {   try 
        {
            const code = req.params.id;
            const customer = await this.customerService.getCustomerById(code);
            
            res.json(customer);
        } 
        catch (error) 
        {   
            console.error("Erro ao buscar cliente:", error);

            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }
        }
    }

    login = async (req: Request, res: Response) =>
    {
        try 
        {
            const { email, password } = req.body;

            const token = await this.customerService.login(email, password);

            res.json({token: token});
        } 
        catch (error) 
        {
            console.error("Erro ao fazer login:", error);

            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }
        }
    }

    extract = async( req: Request, res: Response) =>
    {
        try 
        {   
            const customerId = req.params.id;
            const extract = await this.customerService.extract(customerId);
           
            res.json(extract);
        } 
        catch (error) 
        {
            console.error("Erro gerar consulta:", error);

            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }
           
        }
    }
}
