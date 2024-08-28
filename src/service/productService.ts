import { getManager, QueryRunner } from "typeorm";
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

    async insertProductOperation (products: InsertProductOperation[], queryRunner: QueryRunner)
    {   
        const validatedData = schemaInsertProduct.parse({products: products});

        let idProduct;

        const savePromises = validatedData.products.map(async operation =>
        {   
            idProduct = Number(operation.produto);

            const product = await validateIdBody(productRepository, idProduct, "Produto");

            product.quantidade += operation.quantidade;

            await queryRunner.manager.save(product);

            const insertProductOperation = insertProductOperationRepository.create({
                ...operation,
                produto: product,
            });
            
            return queryRunner.manager.save(insertProductOperation);
        })

        await Promise.all(savePromises);  

        await queryRunner.commitTransaction()
    }

    async removeProductOperation (removeProductOperation: RemoveProductOperation, removeProductsOperationDetail: RemoveProductOperationDetail[], queryRunner: QueryRunner)
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

        const removeProductOperationCreated = await queryRunner.manager.save(newRemoveProductOperation);
        
        let saldoAtual = 0;

        saldoAtual = customer.ecosaldo;

        await this.validateCustomerBalance(customer.ecosaldo, Number(removeProductOperationCreated.ecoSaldoTotal));

        customer.ecosaldo -= Number(removeProductOperationCreated.ecoSaldoTotal);

        await queryRunner.manager.save(customer);

        

        for (const detail of validatedData.detail)
        {
            idProduct = Number(detail.produto);

            product = await validateIdBody(productRepository, idProduct, "Produto");

            await this.validateProductQuantity(product.quantidade, detail.quantidade, product.nome);

            product.quantidade -= detail.quantidade;
            await queryRunner.manager.save(product);
            
            saldoAtual -= detail.subtotal;
            detail.saldoAtualCustomer = saldoAtual;

            detail.removeProductOperation = removeProductOperationCreated;
            const removeProductOperationDetailEntity = removeProductOperationDetailRepository.create({
                ...detail,
                product,
            });
        
            await queryRunner.manager.save(removeProductOperationDetailEntity);
        }

        await queryRunner.commitTransaction()
    }

    async validateCustomerBalance(customerBalance: number, totalBalance: number)
    {   

    
        if(customerBalance < totalBalance)
        {   
            throw new Error("Saldo insuficiente para esta operação");
        }
    }

    async validateProductQuantity(productQuantity: number, totalQuantity: number, product: string)
    {
        if(productQuantity < totalQuantity)
        {
            throw new Error(`Produto ${product} insuficiente em estoque`);
        }
    }
    
}