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
import { validateDelete, validateEntityName, validateIdBody, validateIdParam } from "../utils/validations";
import { idSchema } from "../validators/idValidator";
import { schemaInsertProduct } from "../validators/insertProductOperationValidator";
import { productSchema } from "../validators/productValidator";

export class ProductService
{
    async createProduct(product: Product)
    {
       
        const validatedData = productSchema.parse(product);
        await validateEntityName(productRepository, 'Produto', validatedData.nome, 'nome')


        let code: number = await new CodeGenerator().generateCode("product");

        validatedData.codigo = code;
        const newProduct = productRepository.create(validatedData);
        await productRepository.save(newProduct);
    }

    async updateProduct(code: string, product: Product)
    {   
        const idValidated = parseInt(idSchema.parse(code));
        const validatedData = productSchema.parse(product);
        await validateEntityName(productRepository, 'Produto', validatedData.nome, 'nome', idValidated);
        await validateIdParam(productRepository, 'Produto', idValidated);

        await productRepository.update
        (   
            {codigo: idValidated},
            {
                ...validatedData
            }
        )
    }

    async deleteProduct(code: string)
    {   
        const idValidated = parseInt(idSchema.parse(code));
        const product = await validateIdParam(productRepository, 'Produto', idValidated);

        await validateDelete(insertProductOperationRepository, {produto: product}, 'Produto');

        await productRepository.delete({ codigo: idValidated });
    }

    async getProductById(code: string)
    {
        const idValidated = parseInt(idSchema.parse(code));
        const product = await validateIdParam(productRepository, 'Produto', idValidated);

        return product
    }

    async insertProductOperation (products: InsertProductOperation[])
    {   
        const validatedData = schemaInsertProduct.parse({products: products});

        let idProduct;

        const savePromises = validatedData.products.map(async operation =>
        {   
            idProduct = Number(operation.produto);

            const product = await validateIdBody(productRepository, idProduct, "Produto");

            product.quantidade += operation.quantidade;

            await productRepository.save(product);
            
            return insertProductOperationRepository.save({...operation, produto: product});
        })

        await Promise.all(savePromises);  
    }

    async removeProductOperation (removeProductOperation: RemoveProductOperation, removeProductsOperationDetail: RemoveProductOperationDetail[])
    {
        let code: number = await new CodeGenerator().generateCode("remove_product_operation");

        removeProductOperation.codigo = code;

        const newRemoveProductOperation = removeProductOperationRepository.create(removeProductOperation);
        const removeProductOperationCreated = await removeProductOperationRepository.save(newRemoveProductOperation);
    
        const customer = await customerRepository.findOneBy({codigo: removeProductOperationCreated.usuario.codigo});

        let saldoAtual = 0;

        if(customer)
        {   

            saldoAtual = customer.ecosaldo;

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

            saldoAtual -= detail.subtotal;
            
            detail.saldoAtualCustomer = saldoAtual;

            detail.removeProductOperation = removeProductOperationCreated;
            return removeProductOperationDetailRepository.save(detail);
        })

        await Promise.all(savePromises);
    }
    
}