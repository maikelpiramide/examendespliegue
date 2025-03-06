import express,{Request,Response} from "express"
import dotenv from "dotenv"
import cors from "cors"
import { initializeConnection } from "./context/MysqlConnector";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./doc/swagger.json"
import {router as routerUsuario} from "./usuarios/infrastructure/rest/usuario.rest.controller";
import { router as routerTransaccion } from "./transacciones/infrastructure/rest/transaccion.res.controller";
dotenv.config();
const app = express();
app.use(express.json())
const api = "/api";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const options: cors.CorsOptions = {
    origin:[
        "http://localhost:5173"
    ]
};


(async () => {
    try {
      await initializeConnection();
    } catch (error) {
      console.error('Error al inicializar la conexión a la base de datos:', error);
    }
})();

/**
 * @swagger
 * /:
 *  get:
 *   description: servidor escuchando app
 *  responses:
 *   200:
 *   description: Servidor escuchando en app cafes
 */
app.get("/",(req:Request,res:Response)=>{
    res.json({message:"Servidor escuchando app pics"})
})
app.use(cors(options));
app.use(api,routerUsuario)
app.use(api,routerTransaccion)

export default app;

  