import { Router } from 'express';
import { productManager } from '../dao/productMongoManager.js';
import { cartManager } from '../dao/cartMongoManager.js';

const router = Router();
const ProductService = new productManager();
const CartService = new cartManager(ProductService);

router.get('/products', async (req, res) => {
    const products = await ProductService.getProducts(req.query);

    res.render(
        'index',
        {
            title: 'Products',
            products: JSON.parse(JSON.stringify(products.docs)),
            prevLink: {
                exist: products.prevLink ? true : false,
                link: products.prevLink
            },
            nextLink: {
                exist: products.nextLink ? true : false,
                link: products.nextLink
            }
        }
    )
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await ProductService.getProducts(req.query);
    res.render(
        'realTimeProducts',
        {
            title: 'Products',
            products: JSON.parse(JSON.stringify(products.docs))
        }
    )
});

router.get('/cart/:cid', async (req, res) => {
    const response = await CartService.getProductsOfCartById(req.params.cid);

    if (response.status === 'error') {
        return res.render(
            'notFound',
            {
                title: 'Not Found',
            }
        );
    }

    res.render(
        'cart',
        {
            title: 'Cart',
            products: JSON.parse(JSON.stringify(response.products))
        }
    )
});

export default router;