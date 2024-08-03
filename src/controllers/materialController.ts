import { Request, Response } from 'express';
import { MaterialService } from '../service/materialService';

export class MaterialController
{
    private materialService = new MaterialService;

    constructor()
    {
        this.materialService = new MaterialService();
    }

    createMaterial = async (req: Request, res: Response) =>
    {
        try 
        {
            await this.materialService.createMaterial(req.body);

            res.status(201).json({ message: 'Material cadastrado com sucesso' });
        } 
        catch (error) 
        {
            console.error("Erro ao criar material:", error);
            res.status(400).json({ error: error });
        }
    }
}