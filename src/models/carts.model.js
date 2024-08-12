import mongoose from "mongoose"

const cartsCollection = "carts"

const cartSchema = mongoose.Schema({    
    user: String,
    email: String,         
    products: {
        type:[
          {
              product:{
              type: mongoose.Schema.Types.ObjectId,
              ref: "products"
              },
            },
        ],
        default:[],
    },
})

const cartsModel = mongoose.model(cartsCollection, cartSchema)

export default cartsModel