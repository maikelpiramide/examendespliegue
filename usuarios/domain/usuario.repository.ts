import Usuario from "./Usuario"
export default interface UsuarioRepository{
    registrar(usuario:Usuario):Promise<Usuario>
    entrar(usuario:Usuario):Promise<Usuario>
    getByEmail(usuario:Usuario):Promise<Usuario>
    //getSaldo(usuario:Usuario):Promise<Usuario>
}