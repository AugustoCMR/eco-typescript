import { NextFunction, Request, Response } from 'express';
import { ProductService } from "../service/productService";
import { productRepository } from '../repositories/productRepository';
import { ManagerDB } from '../utils/managerDB';
import {productSchema} from "../validators/productValidator";
import {idSchema} from "../validators/idValidator";
import {schemaInsertProduct} from "../validators/insertProductOperationValidator";
import {schemaMasterDetail} from "../validators/removeProductOperationValidator";

export class ProductController
{
    private productService: ProductService;
    private managerDB: ManagerDB

    constructor() 
    {
        this.productService = new ProductService();
        this.managerDB = new ManagerDB();
    }

    createProduct = async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            const validatedData = productSchema.parse(req.body.product);

            await this.productService.createProduct(validatedData);

            res.status(201).json({ message: 'Produto cadastrado com sucesso' });
        }
        catch(error)
        {
            console.error("Erro ao criar produto:", error);
            next(error);
        }
    }

    updateProduct = async (req: Request, res: Response, next: NextFunction) =>
    {
        try 
        {
            const idValidated = parseInt(idSchema.parse(req.params.id));
            const validatedData = productSchema.parse(req.body.product);

            await this.productService.updateProduct(idValidated, validatedData);

            res.status(201).json( {message: "Produto atualizado com sucesso"} )
        } 
        catch (error) 
        {
            console.error("Erro ao atualizar produto:", error);
            next(error);
        }
    }

    deleteProduct = async (req: Request, res: Response, next: NextFunction) =>
    {   
        try 
        {
            const idValidated = parseInt(idSchema.parse(req.params.id));

            await this.productService.deleteProduct(idValidated);
    
            res.status(204).send();
        } 
        catch (error)
        {
            console.error("Erro ao deletar produto:", error);
            next(error);
        }
    }

    async getAllProducts (req: Request, res: Response, next: NextFunction)
    {
        try 
        {
            const products = await productRepository.find();

            res.json(products);
        } 
        catch (error) 
        {
            console.error("Erro ao buscar produtos:", error);
            next(error);
        }
    }

    getProductById = async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            const idValidated = parseInt(idSchema.parse(req.params.id));
            const product = await this.productService.getProductById(idValidated);

            res.json(product);
        }
        catch (error) 
        {
            console.error("Erro ao buscar produto:", error);
            next(error);
        }
    }

    insertProductOperation = async (req: Request, res: Response, next: NextFunction) =>
    {   
        const conn = await this.managerDB.openConnection();

        try 
        {
            const validatedData = schemaInsertProduct.parse({products: req.body.produtos});

            await this.productService.insertProductOperation(validatedData, conn);

            res.status(201).json({ message: 'Produtos recebidos com sucesso.' });
        } 
        catch (error) 
        {   
            await conn.rollbackTransaction();
            console.error("Erro ao inserir produtos na operação:", error);
            next(error);
        }
        finally
        {
            await conn.release();
        }
      
    } 

    removeProductOperation = async (req: Request, res: Response, next: NextFunction) =>
    {   
        const conn = await this.managerDB.openConnection();

        try 
        {
            const validatedData = schemaMasterDetail.parse({master: req.body.master, detail: req.body.detail});

            await this.productService.removeProductOperation(validatedData, conn);

            res.status(201).json({ message: 'Retirada de produtos cadastrada com sucesso.' });
        } 
        catch (error) 
        {   
            await conn.rollbackTransaction();
            console.error("Erro ao cadastrar retirada de produtos:", error);
            next(error);
        }
        finally
        {
            await conn.release();
        }
    }
}