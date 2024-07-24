import express from 'express';
import __dirname from './dirname.js';
import handlebars from "express-handlebars"
import productRouter from "./routes/product.router.js"
import cartRouter from "./routes/cart.router.js"
import viewsRouter from "./routes/views.router.js"
import mongoose from "mongoose"
import socket from './socket.js';
import {Server} from 'socket.io';

const PORT = 8080;

const app = express();

const link = process.env.MONGO_URI || 'mongodb://localhost:27017/entrega-final';

mongoose.connect(link)
.then(() => {
    console.log("Mongo connected")
})
.catch ((error) => {
    console.log(error)
});

//Configuracion de app

app.use(express.json())
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));//

//Routes

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

//Handlebars

app.engine(
    "hbs",
    handlebars.engine({
        extname: "hbs",
        defaultlayout: "main",
    })
);
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

//Puerto
const httpServer = app.listen(PORT, () => {
    console.log(`Server listening port http://localhost:${PORT}`);
});

const io = new Server(httpServer);

socket(io);
