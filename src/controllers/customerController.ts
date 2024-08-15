import { Request, Response } from "express";
import { customerRepository } from "../repositories/customerRepository"
import { CustomerService } from "../service/customerService";
import { AppDataSource } from "../data-source";
import { Customer } from "../models/customerModel";

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
            console.error("Erro ao criar cliente:", error);
            res.status(400).json({ error: error });
        }
    };

    updateCustomer = async (req: Request, res: Response) => {
        try 
        {
            const code = parseInt(req.params.id);
            await this.customerService.updateCustomer(code, req.body.customer);

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

    async getAllCustomers (req: Request, res: Response) {
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
    async getCustomerById (req: Request, res: Response) {
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

    async extract (req: Request, res: Response)
    {
        try 
        {   
            const customerId = parseInt(req.params.id);

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
                    ct.id = $1

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
                    ct.id = $1

                ORDER BY 
                    created_at DESC;
            `, [customerId]);

            res.json(extract);
        } 
        catch (error) 
        {
            console.error("Erro gerar consulta:", error);
            res.status(500).json({ error: error});
        }
    }
}
