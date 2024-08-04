import { Request, Response } from 'express';
import { MaterialService } from '../service/materialService';
import { materialRepository } from '../repositories/materialRepository';

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

    async getAllMaterials(req: Request, res: Response)
    {
        try
        {
            const materials = await materialRepository.find();

            res.json(materials);
        }
        catch (error)
        {
            console.error("Erro ao buscar materiais:", error);
            res.status(500).json({ error: error });
        }
    }
}