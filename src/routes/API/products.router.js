import express from "express"
import fs from "fs"
import { fileURLToPath } from 'url'
import path from 'path'
//import Router from "express"
//import { socketServer } from "../../app.js"
import productsModel from "../../models/products.model.js"


// Convierte la URL del módulo actual a una ruta de archivo
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
 

const productsFilePath = path.join(__dirname, '../../data/products.json')

const router = express.Router()

const readProducts = () => {
    if (!fs.existsSync(productsFilePath)) {
     return []
    }
   const data = fs.readFileSync(productsFilePath, 'utf-8')
   return JSON.parse(data)
 }

 /*BORRAR
router.get('/products', (req, res) => {
    res.json(readProducts());
    
})
*/

router.get("/products",async (req,res) => {
    try {
        let products = await productsModel.find()
        res.send({result: "success", payload: products})
    } catch (error){
        console.error(error)
    } 
})

//REEMPLAZAR
router.get("/products/:pid",(req,res) =>{    
    const pid = parseInt(req.params.pid) 
    const products =  readProducts() 
    const productoEncontrado = products.find( (product) => product.pid === pid )    
    if(productoEncontrado){
        res.json(productoEncontrado)
    }else {
        res.status(404).json({message: "Producto no encontrado"})
    }

})

/*BORRAR
router.post('/products', (req, res) => {    

    const { title, description, code, price, status , stock, category, thumbnail } = req.body
    const products = readProducts()
    const pid = products.length + 1
    const newProduct = { pid, title, description, code, price, status : true , stock, category, thumbnail }

    products.push(newProduct)
    writeProducts(products)

    res.json({ message: 'Producto agregado'})

    })    
    
    const writeProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))      
}
    */


router.post('/products',async (req,res) => {
    let {title, description, code, price, status, stock  } = req.body
    if(!title || !description || !code || !price || !status || !stock ) {
        res.send({ status: "error", error: "Faltan parámetros"})
    }

    let result = await productsModel.create({title, description, code, price, status, stock})
    res.send({result: "success", payload: result})
})


/*Borrar
router.put('/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid)
    const updatedFields = req.body
    let products = readProducts()
    const productIndex = products.findIndex(p => p.pid == pid)

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }
     
   const updatedProduct = { ...products[productIndex], ...updatedFields }

    products[productIndex] = updatedProduct
    writeProducts(products)

    res.json({ message: 'Producto actualizado'})

})
    */

   router.put('/products/:pid', async (req, res) => {
    let { pid } = req.params

    let productToReplace = req.body
    if(!productToReplace.title || !productToReplace.description || !productToReplace.code || !productToReplace.price 
        || !productToReplace.status || !productToReplace.stock ){
            res.send({status: "error", error: "Faltan parámetros."})
    }
    let result = await productsModel.updateOne({_id: pid }, productToReplace) 
        res.send({ result: "success", payload: result})
    
    })
   
    
/*BORRAR
router.delete('/products/:pid', (req, res) => {
    const { pid } = req.params
    console.log(pid)
    let products = readProducts()
    const filteredProducts = products.filter(p => p.pid != pid)

    if (filteredProducts.length === products.length) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }

    writeProducts(filteredProducts)

    res.json({ message: 'Producto eliminado' })

})
*/

router.delete('/products/:pid',async(req,res) => {
    let { pid } = req.params
    let result = await productsModel.deleteOne({_id: pid})
    res.send({ result: "success", payload: result })    

})



export default router