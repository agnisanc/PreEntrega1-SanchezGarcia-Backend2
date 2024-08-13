import express from 'express';
import __dirname from './dirname.js';
import handlebars from "express-handlebars"
import productRouter from "./routes/product.router.js"
import cartRouter from "./routes/cart.router.js"
import viewsRouter from "./routes/views.router.js"
import authRouter from "./routes/auth.router.js"
import mongoose from "mongoose"
import socket from './socket.js';
import {Server} from 'socket.io';
import passport from "passport";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { initializePassport } from "./config/passport.config.js"

const PORT = 8080;

const app = express();

const link = process.env.MONGO_URI || 'mongodb://localhost:27017/server';

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
app.use(express.static('public'));
app.use(morgan("dev"));
app.use(cookieParser());

//Passport

initializePassport();
app.use(passport.initialize());

//Routes

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);
app.use("/api/auth", authRouter);

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
