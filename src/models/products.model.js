import mongoose from "mongoose"

const productsCollection = "products"

const productSchema = new mongoose.Schema({
    title:{type: String, required: true, max:100},
    description:{type: String, required: true, max:200},
    code:{type: String, required: true, max:100},
    price:{type: Number, required: true, max: 40},
    status:{type: Boolean, default: true, required: true, max: 4},
    stock:{type: Number, required: true, max:10}

})

const userModel = mongoose.model(productsCollection, productSchema)

export default userModel