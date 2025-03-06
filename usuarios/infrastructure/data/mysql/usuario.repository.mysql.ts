
import { getMySqlConnection } from "../../../../context/MysqlConnector";
import Usuario from "../../../domain/Usuario";
import UsuarioRepository from "../../../domain/usuario.repository";
import mysql from "mysql2"

export default class UsuarioRepositoryMysql implements UsuarioRepository{
    async registrar(usuario: Usuario): Promise<Usuario> {
        const connection = getMySqlConnection()

        const [result] = await connection.query("insert into usuario (email,password) values (?,?)",[usuario.email,usuario.password]);
        const affectRows = (result as mysql.ResultSetHeader).affectedRows
        if(affectRows ===0) throw new Error("El usuario no ha podido ser registrado")
        return usuario;
    }
    async entrar(usuario: Usuario): Promise<Usuario> {
        const connection = getMySqlConnection()

        const [result]:any = await connection.query("select * from usuario where email = ?",[usuario.email])
        console.log(result);
        if(result.length === 0) throw new Error("usuario no encontrado en la base de datos")
        return result[0] as Usuario;
    }

    async getByEmail(usuario: Usuario): Promise<Usuario> {
        const connection = getMySqlConnection()

        const [result]:any = await connection.query("select * from usuario where email = ?",[usuario.email])
        if(result.length === 0) throw new Error("usuario no encontrado en la base de datos")
        return result[0] as Usuario;
    }
}