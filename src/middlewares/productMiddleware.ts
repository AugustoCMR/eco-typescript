import { Request, Response, NextFunction } from "express";
import { productRepository } from "../repositories/productRepository";

export async function validateName(req: Request, res: Response, next: NextFunction) 
{
    try 
    {
        const { nome } = req.body.product;

        const checkName = await productRepository.findOneBy({ nome });

        if (checkName) 
        {
            return res.status(400).json({ message: "O Produto informado já possuí cadastro" });
        }

        next();
    } 
    catch (error) 
    {
        console.error('Erro ao validar produto:', error);
        return res.status(500).json({ mensagem: `Ocorreu um erro interno do servidor: ${error}` });
    }
}
