import { NextFunction, Request, Response } from "express";
import { customerRepository } from "../repositories/customerRepository"
import { CustomerService } from "../service/customerService";
import {customerSchema} from "../validators/customerValidator";
import {idSchema} from "../validators/idValidator";

export class CustomerController 
{
    private customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
    }

    createCustomer = async (req: Request, res: Response, next: NextFunction) =>
    {
        try 
        {
            const validatedData = customerSchema.parse(req.body.customer);

            await this.customerService.createCustomer(validatedData);

            res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

        } 
        catch (error) 
        {   
            console.error("Erro ao cadastrar cliente:", error);
            next(error);
        }
    }

    updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
        try 
        {
            const idValidated = parseInt(idSchema.parse(req.params.id));

            const validatedData = customerSchema.parse(req.body.customer);

            await this.customerService.updateCustomer(idValidated, validatedData);

            res.status(200).json({ message: "Usuário atualizado com sucesso!" });

        } 
        catch (error) 
        {
            console.error("Erro ao atualizar cliente:", error);
            next(error);
        }
    };

    deleteCustomer = async (req: Request, res: Response, next: NextFunction) => 
    {
        try 
        {
            const idValidated = parseInt(idSchema.parse(req.params.id));

            await this.customerService.deleteCustomer(idValidated);

            res.status(204).send();
        } 
        catch (error) 
        {
            console.error("Erro ao deletar cliente:", error);
            next(error);
        }
    };

    async getAllCustomers (req: Request, res: Response, next: NextFunction) {
        try 
        {
            const findCustomers = await customerRepository.find();
            
            const customers = findCustomers.map(({senha, ...customer}) => customer );

            res.json(customers);
        } 
        catch (error) 
        {
            console.error("Erro ao buscar clientes:", error);
            next(error);
        }
    }

    getCustomerById = async (req: Request, res: Response, next: NextFunction) =>
    {   try 
        {
            const idValidated = parseInt(idSchema.parse(req.params.id));

            const customer = await this.customerService.getCustomerById(idValidated);
            
            res.json(customer);
        } 
        catch (error) 
        {   
            console.error("Erro ao buscar cliente:", error);
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) =>
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
            next(error);
        }
    }

    extract = async( req: Request, res: Response, next: NextFunction) =>
    {
        try 
        {
            const validatedId = parseInt(idSchema.parse(req.params.id));

            const extract = await this.customerService.extract(validatedId);
           
            res.json(extract);
        } 
        catch (error) 
        {
            console.error("Erro gerar consulta:", error);
            next(error);
        }
    }
}
