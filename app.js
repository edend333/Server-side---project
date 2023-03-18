const express = require("express");
const http = require("http");
const path = require("path");
const { routesInit } = require("./routes/configRoutes")
const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express");
const { ToyModel } = require("./models/toyModel");


// התחברות למסד 
require("./db/mongoConnect")

const app = express();
//  לשלוח באדי מצד לקוח
app.use(express.json());
// להגדיר תיקייה סטטית  
// app.use(express.static(path.join(__dirname,"public")));



// swagger UI
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Library API "
    }
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "My API Documentation"
    },
  ],
  apis: ['./routes/toy.js','./routes/users.js' ],

};

const swaggerDocs = swaggerJsDoc(swaggerOptions)
// console.log(swaggerDocs);






app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


routesInit(app);


const server = http.createServer(app);

server.listen(3001);
// npm install -> כדי להתקין פרוייקט מוכן, שיותקנו בו כל המודולים
