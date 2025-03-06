
import dotenv from "dotenv"
import * as https from "https";
import * as fs from "fs";
dotenv.config()
import app from "./server"

// app.listen(process.env.SERVER_PORT,()=>{
//     console.log(`servidor escuchando por el 8080`)
// })

const key = fs.readFileSync("./privkey.pem");
const cert = fs.readFileSync("cert.pem");
const server = https.createServer({ key, cert }, app);

server.listen(8080, () => {
  console.log(`Application started on port 8080`);
});
