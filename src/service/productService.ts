import { QueryRunner } from "typeorm";
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
import {
    validateDelete,
    validateEntityName,
    validateIdBody,
    validateIdParam,
    validateRepeatedItem
} from "../utils/validations";
import { idSchema } from "../validators/idValidator";
import { schemaInsertProduct } from "../validators/insertProductOperationValidator";
import { productSchema } from "../validators/productValidator";
import { schemaMasterDetail } from "../validators/removeProductOperationValidator";
import { BadRequestError } from "../helpers/api-erros";

export class ProductService
{
    async createProduct(product: productSchema)
    {
        await validateEntityName(productRepository, 'Produto', product.nome, 'nome')

        product.codigo = await new CodeGenerator().generateCode("product");
        const newProduct = productRepository.create(product);
        await productRepository.save(newProduct);
    }

    async updateProduct(code: number, product: productSchema)
    {
        await validateEntityName(productRepository, 'Produto', product.nome, 'nome', code);
        await validateIdParam(productRepository, 'Produto', code);

        await productRepository.update
        (   
            {codigo: code},
            {
                ...product
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

        return await validateIdParam(productRepository, 'Produto', idValidated);
    }

    async insertProductOperation (products: InsertProductOperation[], queryRunner: QueryRunner)
    {   
        const validatedData = schemaInsertProduct.parse({products: products});

        let idProduct;
        let insertedProducts: number[] = [];

        for(let operation of validatedData.products)
        {
            idProduct = Number(operation.produto);

            await validateRepeatedItem(insertedProducts, idProduct);

            insertedProducts.push(idProduct);

            const product = await validateIdBody(productRepository, idProduct, "Produto");

            product.quantidade += operation.quantidade;

            await queryRunner.manager.save(product);

            const insertProductOperation = insertProductOperationRepository.create({
                ...operation,
                produto: product,
            });

            await queryRunner.manager.save(insertProductOperation);
        }

        await queryRunner.commitTransaction()
    }

    async removeProductOperation (removeProductOperation: RemoveProductOperation, removeProductsOperationDetail: RemoveProductOperationDetail[], queryRunner: QueryRunner)
    {   
       

        const validatedData = schemaMasterDetail.parse({master: removeProductOperation, detail: removeProductsOperationDetail});
        

        let idProduct;
        let product;
        let removedProducts: number[] = [];

        const idCustomer = Number(validatedData.master.customer);

        const customer = await validateIdBody(customerRepository, idCustomer, "Usuário");

        validatedData.master.codigo = await new CodeGenerator().generateCode("remove_product_operation");

        const newRemoveProductOperation = removeProductOperationRepository.create(
            {
                ...validatedData.master,
                customer
            }
        );

        const removeProductOperationCreated = await queryRunner.manager.save(newRemoveProductOperation);

        let saldoAtual = customer.ecosaldo;

        await this.validateCustomerBalance(customer.ecosaldo, Number(removeProductOperationCreated.ecoSaldoTotal));

        customer.ecosaldo -= Number(removeProductOperationCreated.ecoSaldoTotal);

        await queryRunner.manager.save(customer);

        for (const detail of validatedData.detail)
        {
            idProduct = Number(detail.produto);

            await validateRepeatedItem(removedProducts, idProduct);

            removedProducts.push(idProduct);

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
            throw new BadRequestError("Saldo insuficiente para esta operação");
        }
    }

    async validateProductQuantity(productQuantity: number, totalQuantity: number, product: string)
    {
        if(productQuantity < totalQuantity)
        {
            throw new BadRequestError(`Produto ${product} insuficiente em estoque`);
        }
    }
    
}