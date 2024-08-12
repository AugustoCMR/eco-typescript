import { Request, Response } from 'express';
import { ProductService } from "../service/productService";
import { productRepository } from '../repositories/productRepository';

export class ProductController
{
    private productService: ProductService;

    constructor() 
    {
        this.productService = new ProductService();
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
            res.status(400).json({ error: error });
        }
    }

    updateProduct = async (req: Request, res: Response) =>
    {
        try 
        {
            const code = parseInt(req.params.id);
            await this.productService.updateProduct(code, req.body.product);

            res.status(201).json( {message: "Produto atualizado com sucesso"} )
        } 
        catch (error) 
        {
            console.error("Erro ao atualizar produto:", error);
            res.status(400).json({ error: error });
        }
    }

    deleteProduct = async (req: Request, res: Response) =>
    {   
        try 
        {
            const code = parseInt(req.params.id);
            await this.productService.deleteProduct(code);
    
            res.status(204).send();
        } 
        catch (error)
        {
            console.error("Erro ao deletar produto:", error);
            res.status(400).json({ error: error });
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

    async getProductById(req: Request, res: Response)
    {
        try
        {
            const code = parseInt(req.params.id);
            const produto = await productRepository.findOneBy({codigo: code});

            if(produto)
            {
                res.json(produto);
            }
            else
            {
                res.status(404).json({ message: 'Produto não encontrado'});
            } 
        }
        catch (error) 
        {
            console.error("Erro ao buscar produto:", error);
            res.status(500).json({ error: error});
        }
    }

    insertProductOperation = async (req: Request, res: Response) =>
    {
        try 
        {
            await this.productService.insertProductOperation(req.body.produtos);

            res.status(201).json({ message: 'Produtos recebidos com sucesso.' });
        } 
        catch (error) 
        {
            console.error("Erro ao inserir produtos na operação:", error);
            res.status(500).json({ error: error});
        }
    } 

    removeProductOperation = async (req: Request, res: Response) =>
    {
        try 
        {
            await this.productService.removeProductOperation(req.body.mestre, req.body.detalhe);
            
            res.status(201).json({ message: 'Retirada de produtos cadastrada com sucesso.' });
        } 
        catch (error) 
        {
            console.error("Erro ao cadastrar retirada de produtos:", error);
            res.status(500).json({ error: error});
        }
    }
}