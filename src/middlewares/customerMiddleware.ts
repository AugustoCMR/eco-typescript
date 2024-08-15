import { Request, Response, NextFunction } from "express";
import { customerRepository } from "../repositories/customerRepository";
export async function validateCPF(req: Request, res: Response, next: NextFunction)
{
    try 
    {
        const { cpf } = req.body.customer;

        const checkCPF = await customerRepository.findOneBy({ cpf });
        
        if(checkCPF)
        {
            return res.status(400).json({ message: "O CPF informado já possuí cadastro" });
        }

        next();
    } 
    catch (error) 
    {
        console.error('Erro ao validar cpf:', error);
        return res.status(500).json({mensagem: `Ocorreu um erro interno do servidor: ${error}`});
    }
      
}

export async function validateEmail(req: Request, res: Response, next: NextFunction)
{
    try 
    {
        const { email } = req.body.customer;

        const checkEmail = await customerRepository.findOneBy({ email });

        if(checkEmail)
        {
            return res.status(400).json({ message: "O E-mail informado já possuí cadastro" });
        }

        next();
    } 
    catch (error) 
    {
        console.error('Erro ao validar e-mail:', error);
        return res.status(500).json({mensagem: `Ocorreu um erro interno do servidor: ${error}`});
    }
}