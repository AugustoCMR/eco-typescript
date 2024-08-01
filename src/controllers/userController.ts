import { Request, Response } from 'express';
import { userRepository } from '../repositories/userRepository';
import { UserService } from '../service/userService';


export class UserController
{

    private userService: UserService;

    constructor()
    {
        this.userService = new UserService();
    }

    createUser = async (req: Request, res: Response) => {   
        try 
        {   
            await this.userService.createUser(req.body);

            res.status(201).json({ message: 'Usuário cadastrado com sucesso!'});

        } 
        catch (error) 
        {
            console.error("Erro ao criar cliente:", error);
            res.status(400).json({ error: error });
        }
    }

    async getAllUsers(req: Request, res: Response)
    {
        try
        {
            const users = await userRepository.find();

            res.json(users);
        }
        catch(error)
        {
            console.error("Erro ao buscar clientes:", error);
            res.status(500).json({ error: error });
        }
    }
    async getUserById(req: Request, res: Response)
    {   
        try
        {
            const id = parseInt(req.params.id);

            const user = await userRepository.findOneBy({codigo : id});

            if(user)
            {
                res.json(user);
            }
            else
            {
                res.status(404).json({ message: 'Usuário não encontrado' });
            }
        }   
        catch(error)
        {
            console.error("Erro ao buscar cliente:", error);
            res.status(500).json({ error: error});
        }
        
    }
}