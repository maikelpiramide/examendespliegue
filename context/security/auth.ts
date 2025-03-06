import { NextFunction,Request,response,Response } from "express";
import jwt, {Secret} from "jsonwebtoken";
import Usuario from "../../usuarios/domain/Usuario";
import dotenv from "dotenv";
dotenv.config()

const SECRET_KEY:Secret = "miClave$$"

const decode = (token:String)=>{
    return jwt.decode(token.valueOf())
}

const createToken = (user:Usuario): string =>{

    const payload = {
        email:user.email
    }

    return jwt.sign(payload,SECRET_KEY,{expiresIn:"1 days"})
}


//comprueba si un usuario está autorizado
const isAuth = (req:Request,res:Response,next:NextFunction)=>{
    try{
        //accedemos a la cabecera de autenticacion
        const authHeader = req.headers.authorization
        //comprobamos si la cabecera lleva el token en el split
        const token: string | undefined = authHeader && authHeader.split(" ")[1];

        //si hay token, decodificamos el payload para obtener el alias del usuario ya que lo usaremos para realizar operaciones y así,
        //  saber que usuario ha creado el café, que usuario le da like..etc
        if(token){
            
            //si no sale bien, va al catch
            const decoded:any = jwt.verify(token,SECRET_KEY)

            //  es body.alias pero podría ser cualquier parametro del body 
            // !!! (cuidado con no sobreescribir otros parametros que mande el usuario en el body ya que si se llaman igual, este chafa el del usuario) !!!!!, 
            // lo usaremos como una variable para en el siguiente paso poder hacer uso del usuario,
            //  ya se para setear el usuario que ha creado el registro o para cualquier otra operación en la que se requiran datos del usuario
            req.body.auth = decoded

            //con este next ejecutamos la siguiente función dentro de los parametros del endpoint
            next();

        }else{
            res.status(401).json({message:"Usuario no autorizado"})
        }

    }catch(err){
        console.error(err)
        response.status(401).json({message:"Usuario no autorizado"})
    }
}

const isAdmin = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        
        const auth = req.body.auth
        const separacion = auth.email.split("@")
  
        if(isNaN(Number(separacion[0]))){
            
        
            next();

        }else{
            res.status(401).json({message:"Usuario no autorizado"})
        }

    }catch(err){
        console.error(err)
        response.status(401).json({message:"Usuario no autorizado"})
    }
    
}

export { decode,createToken,isAuth, isAdmin}