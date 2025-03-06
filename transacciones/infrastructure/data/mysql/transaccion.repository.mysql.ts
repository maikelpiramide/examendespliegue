
import { getMySqlConnection } from "../../../../context/MysqlConnector";
import mysql from "mysql2"
import TransaccionRepository from "../../../domain/transacion.repository";
import Usuario from "../../../../usuarios/domain/Usuario";
import Transaccion from "../../../domain/Transaccion";
import { connect } from "http2";

export default class TransaccionRepositoryMysql implements TransaccionRepository{
    
    async findAll(): Promise<Transaccion[]> {
        const connection = getMySqlConnection()
        // console.log(usuario);
        const transacciones:Transaccion[] = []

        const query = `
            SELECT * FROM transaccion
        `

        const [result]:any = await connection.query(query)
        
        console.log(result);
        result.forEach((t:any) => {
            const user:Usuario={
                email:t.email_usuario
            }
            const conserje:Usuario={
                email:t.email_conserje
            }

            const transaction:Transaccion= {
                id:Number(t.id),
                concepto:t.concepto,
                usuario:user,
                conserje:conserje,
                importe:t.importe,
                timestamp:t.timestamp
            }
            transacciones.push(transaction)
        });

        return transacciones
    }

    async getByUser(usuario: Usuario): Promise<Transaccion[]> {
        const connection = getMySqlConnection()
        // console.log(usuario);
        const transacciones:Transaccion[] = []

        const query = `
            SELECT * FROM transaccion
            WHERE email_usuario = ?
        `

        const [result]:any = await connection.query(query,[usuario.email])
        
        console.log(result);
        result.forEach((t:any) => {
            const user:Usuario={
                email:usuario.email
            }
            const conserje:Usuario={
                email:t.email_conserje
            }

            const transaction:Transaccion= {
                id:Number(t.id),
                concepto:t.concepto,
                usuario:user,
                conserje:conserje,
                importe:t.importe,
                timestamp:t.timestamp
            }
            transacciones.push(transaction)
        });

        return transacciones

    }

    async recargar(transaccion:Transaccion): Promise<Transaccion> {
    
        const connection = getMySqlConnection()
        await connection.beginTransaction()
        try{
            const [result] =  await connection.query("insert into transaccion (email_usuario,email_conserje,importe) values (?,?,?) ",[transaccion.usuario?.email,transaccion.conserje?.email,transaccion.importe])
            const insertId = (result as mysql.ResultSetHeader).insertId
    
            if(!insertId) throw new Error("No se ha podido realizar la tarnsaccion")
            
            transaccion.id = insertId

            const [resultUser] = await connection.query("update usuario set saldo = (saldo + ?) where email = ?",[transaccion.importe,transaccion.usuario?.email]) 
            const affect = (resultUser as mysql.ResultSetHeader).affectedRows
            if(affect == 0) throw new Error("error al actualizar saldo usuario")
                
            await Promise.all([result,resultUser]);
            await connection.commit()

            return transaccion; 
        }catch(err){
            console.log(err);
            connection.rollback()
            throw new Error("No se ha podido realizar la transaccion")
        }

    }

    async crearTransaccion(transaccion: Transaccion): Promise<Transaccion> {
        const connection = getMySqlConnection()
        await connection.beginTransaction()
        try{
            const [result] =  await connection.query("insert into transaccion (concepto,email_usuario,email_conserje,importe) values (?,?,?,?) ",[transaccion.concepto,transaccion.usuario?.email,transaccion.conserje?.email,-transaccion.importe])
            const insertId = (result as mysql.ResultSetHeader).insertId
    
            if(!insertId) throw new Error("No se ha podido realizar la tarnsaccion")
            
            transaccion.id = insertId

            const [resultUserInsert] = await connection.query("update usuario set saldo = (saldo - ?) where email = ?",[transaccion.importe,transaccion.usuario?.email]) 
            const affect = (resultUserInsert as mysql.ResultSetHeader).affectedRows
            if(affect == 0) throw new Error("error al actualizar saldo usuario")
                
            await Promise.all([result,resultUserInsert]);
            await connection.commit()

            return transaccion; 
        }catch(err){
            console.log(err);
            connection.rollback()
            throw new Error("No se ha podido realizar la transaccion")
        }

    }

}