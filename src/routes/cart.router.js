import { Router } from 'express';
import { productManager } from '../dao/productMongoManager.js';
import { cartManager } from '../dao/cartMongoManager.js';

const router = Router();
const ProductService = new productManager();
const CartService = new cartManager(ProductService);

router.get('/:cid', async (req, res) => {
    try {
        const result = await CartService.getProductsOfCartById(req.params.cid);

        res.send({
            status: 'sucess',
            payload: result
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', async (req, res) => {
    
    try {
        const result = CartService.createCart();

        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    
    try{
        const result = await CartService.addProductById(req.params.cid, req.params.pid)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    try{
        const result = await CartService.deleteProductById(req.params.cid, req.body.products)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid', async (req, res) => {

    try {
        const result = await CartService.updateAllProducts(req.params.cid, req.body.products)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put("/:cid/product/:pid", async (req, res) => {

    try {
        const result = await CartService.updateProductById(req.params.cid, req.params.pid, req.body.quantity)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;