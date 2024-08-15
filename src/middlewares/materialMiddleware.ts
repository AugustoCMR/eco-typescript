import { Request, Response, NextFunction } from "express";
import { materialRepository } from "../repositories/materialRepository";

export async function validateName(req: Request, res: Response, next: NextFunction) 
{
    try 
    {const { nome } = req.body.material;

        const checkName = await materialRepository.findOneBy({ nome });

        if (checkName) {
        return res
            .status(400)
            .json({ message: "O Material informado já possuí cadastro" });
        }

        next();
        
    } 
    catch (error) 
    {
        console.error('Erro ao validar material:', error);
        return res.status(500).json({ mensagem: `Ocorreu um erro interno do servidor: ${error}` });
    }
}
