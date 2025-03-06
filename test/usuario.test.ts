import request from 'supertest';
import app from '../server';
import { initializeConnection } from '../context/MysqlConnector';
import { getMySqlConnection } from '../context/MysqlConnector';
import exp from 'constants';

beforeAll(async () => {
    // Create MySQL connection
    try{
      await initializeConnection();
    }catch(error){
      console.error('Error al conectar a la base de datos:', error);
    }
  });

describe('Usuario test Controller', () => {

    const userRegister= {
        email: '1234567@gmail.com',
        password: '1234',
    }

    describe('POST /usuarios/registro', () => {

        it("Deve registrar el usuario y devolver un token junto con el usuario",async ()=>{

            const response = await request(app)
            .post('/api/usuarios/registro')
            .send(userRegister);

            expect(response.status).toBe(200);
    
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe("Usuario registrado correctamente")
        })


        it("Deve mostrar un error si el emial no es válido",async ()=>{

          const response = await request(app)
          .post('/api/usuarios/registro')
          .send({
            email:"adasfd@gmail.com",
            password:"1234"
          });

          expect(response.status).toBe(400);
  
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toBe("no se ha podido registrar el usuario")
      })

    })

    describe('GET /usuarios/saldo', () => {



        it("Deve mostrar el saldo del usuario",async ()=>{

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
          .get('/api/usuarios/saldo')
          .set('Authorization', `Bearer ${userToken}`)

          expect(response.status).toBe(200);

          expect(response.body).toHaveProperty('saldo');
          expect(!isNaN(response.body.saldo)).toBe(true)
      })
      it("Deve mostrar un mensaje de no autorizado si el token no es valido",async ()=>{
          
        const userToken = "asdfasdfqwetqwegva;vfsdb"

        const response = await request(app)
        .get('/api/usuarios/saldo')
        .set('Authorization', `Bearer ${userToken}`)
        expect(response.status).toBe(401);

      })

    })


    afterAll(async ()=>{
        const connection = getMySqlConnection()
        await connection.query("delete from usuario where email = ?",[userRegister.email])
    })

})