import { NextFunction, Request, Response } from 'express';
import { MaterialService } from '../service/materialService';
import { materialRepository } from '../repositories/materialRepository';
import { AppDataSource } from '../data-source';
import { Customer } from '../models/customerModel';
import { ManagerDB } from '../utils/managerDB';
import {materialSchema} from "../validators/materialValidator";
import {idSchema} from "../validators/idValidator";
import {schemaMasterDetail} from "../validators/receivedMaterialValidator";

export class MaterialController
{
    private materialService = new MaterialService;
    private managerDB: ManagerDB;

    constructor()
    {
        this.materialService = new MaterialService();
        this.managerDB = new ManagerDB();
    }

    createMaterial = async (req: Request, res: Response, next: NextFunction) =>
    {
        try 
        {
            const validatedData = materialSchema.parse(req.body.material);

            await this.materialService.createMaterial(validatedData);

            res.status(201).json({ message: 'Material cadastrado com sucesso' });
        } 
        catch (error) 
        {
            console.error("Erro ao criar material:", error);
            
            next(error);

        }
    }

    updateMaterial = async (req: Request, res: Response, next: NextFunction) =>
    {
        try 
        {
            const validatedId = parseInt(idSchema.parse(req.params.id));
            const validatedData = materialSchema.parse(req.body.material);

            await this.materialService.updateMaterial(validatedId, validatedData);
            
            res.status(201).json( {message: "Material atualizado com sucesso"} )
        } 
        catch (error) 
        {
            console.error("Erro ao atualizar material:", error);
            
            next(error);
    }
    }

    deleteMaterial = async (req: Request, res: Response, next: NextFunction) =>
    {
        try 
        {

            const validatedId = parseInt(idSchema.parse(req.params.id));

            await this.materialService.deleteMaterial(validatedId);

            res.status(204).send();
        }
        catch (error) 
        {
            console.error("Erro ao deletar material:", error);
           
            next(error);
        }

    }

    async getAllMaterials (req: Request, res: Response, next: NextFunction)
    {
        try
        {
            const materials = await materialRepository.find();

            res.json(materials);
        }
        catch (error)
        {
            console.error("Erro ao buscar materiais:", error);
            next(error);
        }
    }

    getMaterialById = async (req: Request, res: Response, next: NextFunction) =>
    {
        try 
        {
            const validatedId = parseInt(idSchema.parse(req.params.id));

            const material = await this.materialService.getMaterialById(validatedId);
            

            res.json(material);  
        } 
        catch (error) 
        {
            console.error("Erro ao buscar material:", error);
            
            next(error);
        }
    }

    receivedMaterial = async (req: Request, res: Response, next: NextFunction) =>
    {   

        const conn = await this.managerDB.openConnection();

        try 
        {
            const validatedData = schemaMasterDetail.parse(req.body.master, req.body.detail);

            await this.materialService.receivedMaterial(validatedData, conn);

            res.status(201).json({ message: 'Recebimento de material cadastrado com sucesso.' });
        } 
        catch (error) 
        {
            await conn.rollbackTransaction();
            console.error("Erro ao cadastrar recebimento de materiais:", error);
            
            next(error);
        }
        finally
        {
            await conn.release();
        }
    }

    async detailedMaterialFetch (req: Request, res: Response, next: NextFunction)
    {
        try 
        {
            const materials = await this.materialService.detailedMaterialFetch();
            
            res.json(materials);
        } 
        catch (error) 
        {
            console.error("Erro gerar consulta:", error);
            next(error);
        }
    }
}