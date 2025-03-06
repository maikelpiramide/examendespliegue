import Usuario from "../../usuarios/domain/Usuario"

export default interface Transaccion {
    id?:Number
    concepto?:String
    usuario?:Usuario
    conserje?:Usuario
    importe:Number
    timestamp?:Date
}