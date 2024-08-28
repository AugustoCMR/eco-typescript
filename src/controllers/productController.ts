import { Request, Response } from 'express';
import { ProductService } from "../service/productService";
import { productRepository } from '../repositories/productRepository';
import { ZodError } from 'zod';
import { ManagerDB } from '../utils/managerDB';

export class ProductController
{
    private productService: ProductService;
    private managerDB: ManagerDB

    constructor() 
    {
        this.productService = new ProductService();
        this.managerDB = new ManagerDB();
    }

    createProduct = async (req: Request, res: Response) =>
    {
        try
        {
            await this.productService.createProduct(req.body.product);

            res.status(201).json({ message: 'Produto cadastrado com sucesso' });
        }
        catch(error)
        {
            console.error("Erro ao criar produto:", error);
            
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

    updateProduct = async (req: Request, res: Response) =>
    {
        try 
        {
            const code = req.params.id;
            await this.productService.updateProduct(code, req.body.product);

            res.status(201).json( {message: "Produto atualizado com sucesso"} )
        } 
        catch (error) 
        {
            console.error("Erro ao atualizar produto:", error);
            
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

    deleteProduct = async (req: Request, res: Response) =>
    {   
        try 
        {
            const code = req.params.id;
            await this.productService.deleteProduct(code);
    
            res.status(204).send();
        } 
        catch (error)
        {
            console.error("Erro ao deletar produto:", error);
            
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

    async getAllProducts (req: Request, res: Response)
    {
        try 
        {
            const products = await productRepository.find();

            res.json(products);
        } 
        catch (error) 
        {
            console.error("Erro ao buscar produtos:", error);
            res.status(500).json({ error: error });
        }
    }

    getProductById = async (req: Request, res: Response) =>
    {
        try
        {
            const code = req.params.id;
            const product = await this.productService.getProductById(code);

            res.json(product);
        }
        catch (error) 
        {
            console.error("Erro ao buscar produto:", error);
            
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

    insertProductOperation = async (req: Request, res: Response) =>
    {   
        const conn = await this.managerDB.openConnection();

        try 
        {
            await this.productService.insertProductOperation(req.body.produtos, conn);

            res.status(201).json({ message: 'Produtos recebidos com sucesso.' });
        } 
        catch (error) 
        {   
            await conn.rollbackTransaction();
            console.error("Erro ao inserir produtos na operação:", error);
            
            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }
        }
        finally
        {
            await conn.release();
        }
      
    } 

    removeProductOperation = async (req: Request, res: Response) =>
    {   
        const conn = await this.managerDB.openConnection();

        try 
        {
            await this.productService.removeProductOperation(req.body.master, req.body.detail, conn);

            res.status(201).json({ message: 'Retirada de produtos cadastrada com sucesso.' });
        } 
        catch (error) 
        {   
            await conn.rollbackTransaction();
            console.error("Erro ao cadastrar retirada de produtos:", error);
            
            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }
        }
        finally
        {
            await conn.release();
        }
    }
}