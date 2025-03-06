import request from 'supertest';
import app from '../server';
import { initializeConnection } from '../context/MysqlConnector';

beforeAll(async () => {
    // Create MySQL connection
    try{
      await initializeConnection();
    }catch(error){
      console.error('Error al conectar a la base de datos:', error);
    }
  });

describe('Usuario test Controller', () => {

    describe('GET /api/transacciones', () => {

        it("Deve mostrar con un token válido las transacciones del usuario",async ()=>{

          const responseUser = await request(app)
            .post("/api/usuarios/entrar")
            .send({
              email:"123456@fppiramide.com",
              password:"1234"
            })
            expect(responseUser.body).toHaveProperty("result")
            expect(responseUser.body.result).toHaveProperty("token")
            

          const userToken = responseUser.body.result.token

          const response = await request(app)
          .get('/api/transacciones')
          .set('Authorization', `Bearer ${userToken}`)
          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
      })
      it("Deve devolver status 401 con un token inválido",async ()=>{
            
            const userToken = "asdfasdwtwrhgadfbv"

            const response = await request(app)
            .get('/api/transacciones')
            .set('Authorization', `Bearer ${userToken}`)
            expect(response.status).toBe(401);
        })
     

    })

})