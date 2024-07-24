import productModel from "./models/productModel.js"

class productManager {

    //Get all the products

    async getProducts(params) {
        const paginate = {
            page: params.page ? parseInt(params.page) : 1,
            limit: params.imit ? parseInt(params.limit): 10,
        }

        if (params.sort && (params.sort === 'asc' || params.sort === 'desc'))
            paginate.sort = { price: params.sort}
            const products = await productModel.paginate({}, paginate);

            products.prevLink = products.hasPrevPage?`http://localhost:5000/products?page=${products.prevPage}` : null;
            products.nextLink = products.hasNextPage?`http://localhost:5000/products?page=${products.nextPage}` : null;

        //Limits
        if (products.prevLink && paginate.limit !== 10) products.prevLink += `&limit=${paginate.limit}`
        if (products.nextLink && paginate.limit !== 10) products.nextLink += `&limit=${paginate.limit}`

        return products;
    }

    //Get a product by its ID

    async getProductsById(pid) {
        const product = await productModel.findOne({_id: pid});

        if (!product) {
            throw new Error (`The product with Id: ${pid} does not exist.`)
        }
        return product;
    }

    async creacteProduct(product) {
        const {title, description, code, price, stock, category, thumbnail} = product;

        if (!title || !description || !code || !thumbnail || !price || !stock || !category) {
            throw new Error('An error occured while trying to create the product');
        }

        return await productModel.create({title, description, code, price, stock, category, thumbnail});
    }

    //Update a product

    async updateProduct(pid, productUpdate) {
        return await productModel.updateOne({_id: pid}, productUpdate);
    }

    //Delete a product

    async deleteProduct(pid) {
        const result = await productModel.deleteOne({_id: pid});

        if(result.deletedCount === 0){
            throw new Error(`The product with Id: ${pid} does not exist.`)
        }

        return result;
    }
}

export { productManager }