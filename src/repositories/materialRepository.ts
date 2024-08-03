import { AppDataSource } from "../data-source";
import { Material } from "../models/materialModel";

export const materialRepository = AppDataSource.getRepository(Material);
