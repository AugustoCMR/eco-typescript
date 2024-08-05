import { AppDataSource } from "../data-source";
import { Product } from "../models/productModel";


export const productRepository = AppDataSource.getRepository(Product);
