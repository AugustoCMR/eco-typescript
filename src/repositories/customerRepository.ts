import { AppDataSource } from "../data-source";
import { Customer } from "../models/customerModel";

export const customerRepository = AppDataSource.getRepository(Customer);
