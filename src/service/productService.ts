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
import { schemaMasterDetail } from "../validators/removeProductOperationValidator";

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
        const validatedData = schemaMasterDetail.parse({master: removeProductOperation, detail: removeProductsOperationDetail});
        

        let idProduct;
        let product;

        const idCustomer = Number(validatedData.master.customer);

        const customer = await validateIdBody(customerRepository, idCustomer, "Usuário");

        let code: number = await new CodeGenerator().generateCode("remove_product_operation");

        validatedData.master.codigo = code;

        const newRemoveProductOperation = removeProductOperationRepository.create(
            {
                ...validatedData.master,
                customer
            }
        );

        const removeProductOperationCreated = await removeProductOperationRepository.save(newRemoveProductOperation);
    
        let saldoAtual = 0;

        saldoAtual = customer.ecosaldo;

        customer.ecosaldo -= Number(removeProductOperationCreated.ecoSaldoTotal);

        await customerRepository.save(customer);
        
        const savePromises = validatedData.detail.map(async detail =>
        {
            idProduct = Number(detail.produto);

            product = await validateIdBody(productRepository, idProduct, "Produto");

            product.quantidade -= detail.quantidade;
            await productRepository.save(product);
            
            saldoAtual -= detail.subtotal;
            detail.saldoAtualCustomer = saldoAtual;

            detail.removeProductOperation = removeProductOperationCreated;
            return removeProductOperationDetailRepository.save({...detail, product});
        })

        await Promise.all(savePromises);
    }
    
}