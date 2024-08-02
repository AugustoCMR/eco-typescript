import { AppDataSource } from "../data-source";
import { Residue } from "../models/residueModel";

export const residueRepository = AppDataSource.getRepository(Residue);