import { AppDataSource } from "../data-source";
import { RemoveProductOperationDetail } from "../models/removeProductOperationDetailModel";


export const removeProductOperationDetailRepository = AppDataSource.getRepository(RemoveProductOperationDetail);
