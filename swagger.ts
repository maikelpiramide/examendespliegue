import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "demo API",
    description: "API para cartera PICs",
  },
  host: "localhost:8080/",
};

const outputFile = "./doc/swagger.json";
const routes = ["./server.ts"];

swaggerAutogen()(outputFile, routes, doc);