import { AppDataSource } from "../data-source";
import { ReceivedMaterialDetail } from "../models/receivedMaterialDetailModel";

export const receivedMaterialDetailRepository = AppDataSource.getRepository(ReceivedMaterialDetail);
