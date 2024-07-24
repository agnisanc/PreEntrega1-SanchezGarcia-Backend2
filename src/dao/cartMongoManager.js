import { cartModel } from "./models/cartModel.js"

class cartManager {

    constructor(productManager) {
        this.productManager = productManager;
    }

    //Get the carts

    async getCarts() {
        return cartModel.find();
    }

    async getProductsOfCartById (cid) {
        const cart = await cartModel.findOne({_id: cid}).populate('products.product');

        if(!cart) {
            throw new Error (`The cart with ID: ${cid} does not exist.`)
        }

        return cart;
    }

    //Create a new cart

    async createCart() {
        return await cartModel.create({products: []});
    }

    //Add a product to a cart using its ID

    async addProductById(cid, pid) {
        await this.productManager.getProductsById(pid);

        const cart = await cartModel.findOne({_id: cid});

        if(!cart) {
            throw new Error (`The cart with ID: ${cid} does not exist.`)
        }

        let i = null;
        const result = cart.products.filter(
            (item, index) => {
                if(item.product.toString() === pid) i = index;
                return item.product.toString() === pid;
            }
        );

        if (result.lenght > 0) {
            cart.products[i].quantity += 1;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        }

        await cartModel.updateOne({_id: cid}, {products: cart.products});

        return await this.getProductsOfCartById(cid)
    }

    //Delete a product from a cart with the ID

    async deleteProductById(cid, pid) {
        await this.productManager.getProductsById(pid);

        const cart = await cartModel.findOne({_id: cid});

        if(!cart) {
            throw new Error (`The cart with ID: ${cid} does not exist.`)
        }

        let i = null
        const newProducts = cart.products.filter(item => item.product.toString() !== pid);
        await cartModel.updateOne({_id: cid}, {products: newProducts});

        return await this.getProductsOfCartById(cid);
    }

    async updateAllProducts (cid, products) {

        for(let key in products) {
            await this.productManager.getProductsById(products[key].product);
        }

        await cartModel.updateOne({_id: cid}, {products: products});

        return await this.getProductsOfCartById(cid)
    }

    async updateProductById(cid, pid, quantity) {
        if (!quantity || isNaN(parseInt(quantity))){
            throw new Error(`The quantity indicated is not valid.`)
        }
        await this.productManager.getProductsById(pid);

        const cart = await cartModel.findOne({_id: cid});

        if (!cart) {
            throw new Error(`The cart with ID: ${cid} does not exist.`);
        }

        let i = null;
        const result = cart.products.filter(
            (item, index) => {
                if (item.product.toString() === pid) i = index;
                return item.product.toString() === pid;
            }
        );

        if (result.lenght === 0) {
            throw new Error(`The product with ID: ${pid} does not exist in the cart with I ${cid}!`)
        }
        
        cart.products[i].quantity = parseInt(quantity);
        await cartModel.updateOne({_id: cid}, {products: cart.products});
        
        return await this.getProductsOfCartById(cid);
    }

    async deleteAllProducts(cid) {

        await cartModel.updateOne({_id:cid}, {products: []});

        return await this.getProductsOfCartById(cid)
    }
}

export { cartManager };
