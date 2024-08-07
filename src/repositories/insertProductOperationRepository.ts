import { AppDataSource } from "../data-source";
import { InsertProductOperation } from "../models/insertProductOperationModel";


export const insertProductOperationRepository = AppDataSource.getRepository(InsertProductOperation);
