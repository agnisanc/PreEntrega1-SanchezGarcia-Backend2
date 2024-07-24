import { Router } from "express";
import { productManager } from "../dao/productMongoManager.js"
import { uploader } from "../config/multer.config.js"

const router = Router();

const ProductService = new productManager();

router.get("/", async (req, res) => {
    const result = await ProductService.getProducts(req.query);

    res.send({
        status: 'success',
        payload: result
    });
});

router.get("/:pid", async (req, res) => {

    try{
        const result = await ProductService.getProductsById(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        })
    } catch {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
});

router.post('/', uploader.array('thumbnail', 3), async (req, res) => {
    if(req.files) {
        req.body.thumbnail = [];
        req.files.forEach((file) => {
            req.body.thumbnail.push(file.path);
        });
    }

    try {
        const result = await ProductService.creacteProduct(req.body);
            res.send({
                status: 'success',
                payload: result
            });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

router.put('/:pid', uploader.array('thumbnail', 3), async (req, res) => {
    if(req.files) {
        req.body.thumbnail = [];
        req.files.forEach((file) => {
            req.body.thumbnail.push(file.filename);
        })
    }

    try {
        const result = await ProductService.updateProduct(req.params.pid, req.body);
            res.send({
                status: 'success',
                payload: result
            });
    }   catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const result = await ProductService.deleteProduct(req.params.pid);
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