import express from "express"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import viewRouter from "../src/routes/view.router.js"
import { Server } from "socket.io"
import productsRouter  from "./routes/API/products.router.js"
import cartsRouter  from "./routes/API/carts.router.js"
import fs from "fs"
import path from "path"
import mongoose from "mongoose"

const app = express()    
const PORT = 8080

const productsFilePath = path.join(__dirname, 'src/data/products.json')

// Función para leer productos
const readProducts = () => {
    if (!fs.existsSync(productsFilePath)) {
        return []
    }
    const data = fs.readFileSync(productsFilePath, 'utf-8')
    return JSON.parse(data);
};

//Middlewares
app.use(express.json()) // para que pueda recibir json
app.use(express.urlencoded({extended:true})) //permite que se pueda enviar informacion desde una url

app.engine('handlebars',handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine','handlebars')
app.use(express.static(__dirname + '/public'))

export { socketServer }

app.use("/", productsRouter)
app.use("/", cartsRouter)
app.use('/',viewRouter)


//conexión a la base
mongoose.connect("mongodb+srv://admin:Coder2024@cluster0.8vmpp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
 .then(()=>{
    console.log("Conectado a la base de datos")
 })
 .catch(error=>{
    console.log("Error al conectar con la base de datos.",error)
 })


const httpServer = app.listen(PORT, () => console.log(`Server runinng on PORT: ${PORT}`))

const socketServer = new Server(httpServer)

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado")

    socket.on('message',data => {
        console.log(`soy la data ${data}`)
    })

 // Enviar la lista inicial de productos al cliente
 socket.emit('productUpdate', readProducts())
  
})

