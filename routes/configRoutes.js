const usersR = require("./users");
const toyR = require("./toy");


exports.routesInit = (app) => {
  app.use("/users",usersR);
  app.use("/toy",toyR);


}
