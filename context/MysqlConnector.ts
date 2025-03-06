
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let connection: mysql.Connection;

export const initializeConnection = async (): Promise<void> => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: "database-1.c1kso4sie8xb.us-east-1.rds.amazonaws.com",
      user: "admin",
      password: "Code0clase$$",
      database: "pics",
    });
    console.log('Conexión a la base de datos MySql establecida');
  }
};

export const getMySqlConnection = (): mysql.Connection => {
  if (!connection) {
    throw new Error('La conexión a la base de datos no ha sido inicializada');
  }
  return connection;
};