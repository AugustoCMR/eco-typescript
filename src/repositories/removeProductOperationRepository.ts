import { AppDataSource } from "../data-source";
import { RemoveProductOperation } from "../models/removeProductOperationModel";


export const removeProductOperationRepository = AppDataSource.getRepository(RemoveProductOperation);
