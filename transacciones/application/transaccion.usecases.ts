import TransaccionRepository from "../domain/transacion.repository";
import Usuario from "../../usuarios/domain/Usuario";
import Transaccion from "../domain/Transaccion";
import UsuarioUseCases from "../../usuarios/application/usuario.usecases";
import UsuarioRepositoryMysql from "../../usuarios/infrastructure/data/mysql/usuario.repository.mysql";
export default class TransaccionUseCases{

    private transaccionRepository:TransaccionRepository;
    private usuarioUseCases:UsuarioUseCases = new UsuarioUseCases(new UsuarioRepositoryMysql())

    constructor(transaccionRepository:TransaccionRepository){
        this.transaccionRepository = transaccionRepository
    }

    async findAll():Promise<Transaccion[]>{
        return this.transaccionRepository.findAll()
    }
    async getByUser(usuario:Usuario):Promise<Transaccion[]>{
        return this.transaccionRepository.getByUser(usuario)
    }

    async recargar(transaccion:Transaccion):Promise<Transaccion>
    {
        const user = this.usuarioUseCases.getByEmail(transaccion.usuario as Usuario)
        if(!user) throw new Error("el usuario no existe")

        return this.transaccionRepository.recargar(transaccion);
    }
    async crearTransaccion(transaccion:Transaccion):Promise<Transaccion>
    {
        const user = await this.usuarioUseCases.getByEmail(transaccion.usuario as Usuario)
        if(!user) throw new Error("el usuario no existe")
        const u:Usuario={
            saldo:user.saldo
        }
        if(u.saldo){
            if( u.saldo < transaccion.importe) throw new Error("El usuario no tiene suficientes PICs")
        }
        return this.transaccionRepository.crearTransaccion(transaccion);
    }
}