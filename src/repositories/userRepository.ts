import { AppDataSource } from "../data-source";
import { User } from "../models/userModel";

export const userRepository = AppDataSource.getRepository(User);