import { Request, Response } from 'express';


export class UserController
{
    async getUserById(req: Request, res: Response)
    {
        res.send('Testando');
    }
}