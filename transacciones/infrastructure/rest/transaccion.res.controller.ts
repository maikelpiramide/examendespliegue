import express,{Request,Response} from "express"
import { isAuth,isAdmin} from "../../../context/security/auth"
import TransaccionUseCases from "../../application/transaccion.usecases"
import TransaccionRepositoryMysql from "../data/mysql/transaccion.repository.mysql"
import Usuario from "../../../usuarios/domain/Usuario"
import Transaccion from "../../domain/Transaccion"
const transaccionUseCases:TransaccionUseCases = new TransaccionUseCases(new TransaccionRepositoryMysql())
const router = express.Router()

router.get("/transacciones",isAuth,async(req:Request,res:Response)=>{

    const auth = req.body.auth
    try {

        const user:Usuario = {
            email:auth.email
        }

        const transacciones:Transaccion[] = await transaccionUseCases.getByUser(user);

        res.status(200).json(transacciones)

    } catch (error) {
        console.log(error);
        res.status(400).json({message:"no se han podido obtener las transacciones"})
    }

})

router.get("/transacciones/todas",isAuth,isAdmin,async(req:Request,res:Response)=>{

    
    try {

        const transacciones:Transaccion[] = await transaccionUseCases.findAll();

        res.status(200).json(transacciones)

    } catch (error) {
        console.log(error);
        res.status(400).json({message:"no se han podido obtener las transacciones"})
    }

})

router.post("/transacciones/recargar",isAuth,isAdmin,async(req:Request,res:Response)=>{

    const data = req.body
    const auth = data.auth
    
    try {

        const usuario:Usuario={
            email:data.usuario
        }
        const admin:Usuario ={
            email:auth.email
        }

        const transaccion:Transaccion={
            usuario:usuario,
            conserje:admin,
            importe:data.importe
        }

        const transaccionDB = await transaccionUseCases.recargar(transaccion)
        res.status(200).json({transaccion:transaccionDB,message:"recarga realizada con exito"})

    } catch (error) {
        console.log(error);
        res.status(400).json({message:"no se han podido realizar la recarga"})
    }

})

router.post("/transacciones/recargar",isAuth,isAdmin,async(req:Request,res:Response)=>{

    const data = req.body
    const auth = data.auth
    
    try {

        const usuario:Usuario={
            email:data.usuario
        }
        const admin:Usuario ={
            email:auth.email
        }

        const transaccion:Transaccion={
            usuario:usuario,
            conserje:admin,
            importe:data.importe
        }

        const transaccionDB = await transaccionUseCases.recargar(transaccion)
        res.status(200).json({transaccion:transaccionDB,message:"recarga realizada con exito"})

    } catch (error) {
        console.log(error);
        res.status(400).json({message:"no se han podido realizar la recarga"})
    }

})

router.post("/transacciones/transaccion",isAuth,isAdmin,async(req:Request,res:Response)=>{

    const data = req.body
    const auth = data.auth
    
    try {

        const usuario:Usuario={
            email:data.usuario
        }
        const admin:Usuario ={
            email:auth.email
        }

        const transaccion:Transaccion={
            concepto:data.concepto,
            usuario:usuario,
            conserje:admin,
            importe:data.importe
        }

        const transaccionDB = await transaccionUseCases.crearTransaccion(transaccion)
        res.status(200).json({transaccion:transaccionDB,message:"recarga realizada con exito"})

    } catch (error) {
        console.log(error);
        res.status(400).json({message:"no se han podido realizar la operacion, comprueba que el usuario tenga suficientes PICs"})
    }

})

export {router}