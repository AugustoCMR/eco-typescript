import { InsertProductOperation } from "../models/insertProductOperationModel";
import { Product } from "../models/productModel";
import { RemoveProductOperationDetail } from "../models/removeProductOperationDetailModel";
import { RemoveProductOperation } from "../models/removeProductOperationModel";
import { customerRepository } from "../repositories/customerRepository";
import { insertProductOperationRepository } from "../repositories/insertProductOperationRepository";
import { productRepository } from "../repositories/productRepository";
import { removeProductOperationDetailRepository } from "../repositories/removeProductOperationDetailRepository";
import { removeProductOperationRepository } from "../repositories/removeProductOperationRepository";
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

    async insertProductOperation (product: InsertProductOperation[])
    {   
        const savePromises = product.map(async operation =>
        {   
            const product = await productRepository.findOneBy({id: operation.produto.id});

            if (product) 
            {

                product.quantidade += operation.quantidade;

                await productRepository.save(product);
            }

            return insertProductOperationRepository.save(operation);
        })

        await Promise.all(savePromises);  
    }

    async removeProductOperation (removeProductOperation: RemoveProductOperation, removeProductsOperationDetail: RemoveProductOperationDetail[])
    {
        let code: number = await new CodeGenerator().generateCode("remove_product_operation");

        removeProductOperation.codigo = code;

        const newRemoveProductOperation = removeProductOperationRepository.create(removeProductOperation);
        const removeProductOperationCreated = await removeProductOperationRepository.save(newRemoveProductOperation);

        const customer = await customerRepository.findOneBy({id: removeProductOperationCreated.usuario.id});

        if(customer)
        {   

            customer.ecosaldo -= Number(removeProductOperationCreated.ecoSaldoTotal);

            await customerRepository.save(customer);
        }
        
        const savePromises = removeProductsOperationDetail.map(async detail =>
        {

            const product = await productRepository.findOneBy({id: detail.produto.id});

            if(product)
            {
                product.quantidade -= detail.quantidade;

                await productRepository.save(product);
            }

            detail.removeProductOperation = removeProductOperationCreated;
            return removeProductOperationDetailRepository.save(detail);
        })

        await Promise.all(savePromises);
    }
    
}