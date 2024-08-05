import { AppDataSource } from "../data-source";
import { ReceivedMaterial } from "../models/receivedMaterialModel";

export const receivedMaterialRepository = AppDataSource.getRepository(ReceivedMaterial);
