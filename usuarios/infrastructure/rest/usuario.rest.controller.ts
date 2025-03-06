import express,{Request,Response} from "express"
import UsuarioUseCases from "../../application/usuario.usecases"
import UsuarioRepositoryMysql from "../data/mysql/usuario.repository.mysql"
import Usuario from "../../domain/Usuario"
import { createToken } from "../../../context/security/auth"
import { isAuth } from "../../../context/security/auth"
const usuarioUsecases:UsuarioUseCases = new UsuarioUseCases(new UsuarioRepositoryMysql())
const router = express.Router()

router.post("/usuarios/registro",async(req:Request,res:Response)=>{
    let data = req.body
    console.log(req.body);
    try{
        const user:Usuario={
            email:data.email,
            password:data.password
        }
        const userDB:Usuario = await usuarioUsecases.registrar(user);

        res.status(200).json({message:"Usuario registrado correctamente"})
    }catch(err){
        console.log(err);
        res.status(400).json({message:"no se ha podido registrar el usuario"})
    }
})

router.post("/usuarios/entrar",async(req:Request,res:Response)=>{

    const data = req.body;

    try{

        const usuario:Usuario = {
            email:data.email,
            password:data.password
        }

        const userDB:Usuario = await usuarioUsecases.entrar(usuario);

        const token = createToken(userDB);

        res.status(200).json({message:"usuario verificado con exito",result:{user:userDB,token}})

    }catch(err){
        res.status(400).json({message:"usuario o contraseña incorrectos"})
    }

})

router.get("/usuarios/saldo",isAuth,async(req:Request,res:Response)=>{

    const auth = req.body.auth

    try{    
        const usuario:Usuario = {
            email:auth.email
        }

        const user:Usuario = await usuarioUsecases.getSaldo(usuario);

        res.status(200).json({saldo:user.saldo})
        
    }catch(err){
        console.log(err);
        res.status(400).json({message:"no se ha podido obtener el saldo"})
    }

})



export {router}