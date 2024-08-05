import { Product } from "../models/productModel";
import { productRepository } from "../repositories/productRepository";
import { CodeGenerator } from "../utils/codeGenerator";

export class ProductService
{
    async createProduct(product: Product)
    {
        let code: number = await new CodeGenerator().generateCode("product");

        product.codigo = code;
        const newProduct = productRepository.create(product);
        await productRepository.save(newProduct);
    }

    async updateProduct(code: number, product: Product)
    {
        await productRepository.update
        (   
            {codigo: code},
            {
                ...product
            }
        )
    }

    async deleteProduct(code: number)
    {
        await productRepository.delete({ codigo: code });
    }
}