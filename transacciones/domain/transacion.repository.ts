import Usuario from "../../usuarios/domain/Usuario"
import Transaccion from "./Transaccion"
export default interface TransaccionRepository{
    findAll():Promise<Transaccion[]>
    getByUser(usuario:Usuario):Promise<Transaccion[]>
    recargar(transaccion:Transaccion):Promise<Transaccion>
    crearTransaccion(transaccion:Transaccion):Promise<Transaccion>
}