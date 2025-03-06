import UsuarioRepository from "../domain/usuario.repository";
import Usuario from "../domain/Usuario";
import { hash } from "../../context/security/encripted";
import { compare } from "../../context/security/encripted";
export default class UsuarioUseCases{

    private usuarioRepository:UsuarioRepository;

    constructor(usuarioRepository:UsuarioRepository){
        this.usuarioRepository = usuarioRepository;
    }

    async registrar(usuario:Usuario):Promise<Usuario>
    {
       
        if(!usuario.password) throw new Error("falta contraseña de usuario");
        
        if(usuario.email){
            let separacion:string[];
            separacion = usuario.email.split("@")

            if(isNaN(Number(separacion[0])))
                throw new Error("el usuario no es válido")
        }

        usuario.password = hash(usuario.password.valueOf())

        return this.usuarioRepository.registrar(usuario);
    }

    async entrar(usuario:Usuario):Promise<Usuario>
    {
        console.log("en usuario",usuario);
        if(!usuario.password) throw new Error("Debe indicar una constaseña")

        const user:Usuario = await this.usuarioRepository.entrar(usuario) 
        console.log(user);
        const compareTo = compare(usuario.password,String(user.password))

        if(!compareTo) throw new Error("Usuario o contraseña incorrectos")
            
        return user;
    }

    async getSaldo(usuario:Usuario):Promise<Usuario>
    {
        return this.usuarioRepository.getByEmail(usuario)
    }

    async getByEmail(usuario:Usuario):Promise<Usuario>
    {
        return this.usuarioRepository.getByEmail(usuario)
    }


}