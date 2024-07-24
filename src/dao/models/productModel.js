import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productsSchema = mongoose.Schema({

    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    code: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    thumbnail: {
        type: Array,
        require: false,
        default: []
    },
    status: {
        type: Boolean,
        require: true,
    }
    
});

productsSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productsSchema);

export default productModel;
