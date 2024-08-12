import express  from "express"
import fs from "fs"
import { fileURLToPath } from 'url'
import path from 'path'
import cartsModel from '../../models/carts.model.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartsFilePath = path.join(__dirname, '../../data/carts.json')

const router = express.Router()


const readCarts = () => {
    if (!fs.existsSync(cartsFilePath)) {
     return []
    }
   const data = fs.readFileSync(cartsFilePath, 'utf-8')
   return JSON.parse(data)
 }

router.get("/carts",(req,res) =>{
    res.json(readCarts())
})


//clase 16, uso de populate
router.get("/carts/:cid",(req,res) =>{    
    const cid = parseInt(req.params.cid)      
    const carts = readCarts()
    const cartEncontrado = carts.find((c) => c.cid === cid)
    
    if(cartEncontrado){
        res.json(cartEncontrado)
    }else {
        res.status(404).json({message: "Carrito no encontrado"})
    }

})

/*Borrar
router.post("/carts",(req,res) =>{
    const { products } = req.body
    const carts = readCarts()
    const cid = carts.length + 1
    const newCart = { cid,user,email, products : [] } //este es el formato que pasó el profe
    
    carts.push(newCart)
    writeCarts(carts)
    
    res.json({massage: "Carrito agregado"})
    })

    */

    let writeCarts = (carts) => {
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2))    
    }



router.post("/carts", async (req,res) =>{
    let {user, email, products} = req.body
    if(!user || !email || !products){
        res.send({ status: "error", error: "Faltan parámetros"})  
    }

    let result = await cartsModel.create({user, email, products})
    res.send({result: "success", payload: result})

})

 router.post("/carts/:cid/product/:pid",(req,res) =>{ 
    const cid = parseInt(req.params.cid) 
    const pid = parseInt(req.params.pid) 
    const carts = readCarts() 
    const indexEnc = carts.findIndex((cart) => cart.cid === cid)
    
    if(indexEnc == -1){
        res.status(404).json({message: "Carrito no encontrado."})        
    }
    const { products } = carts [indexEnc]
    
    const indexExist = products.findIndex((p) => p.pid === pid)
    const productoExistente = products.find((p) => p.pid === pid)
         
     if(indexExist == -1){

        const newProduct = {
            pid : pid,
            cantidad : 1
        }
        products.push(newProduct) 
     }else {

        productoExistente.cantidad += 1

     }
             
        writeCarts(carts) 
      
        res.json({massage: "Producto agregado al carrito"})})

    writeCarts = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2))    
    }



export default router