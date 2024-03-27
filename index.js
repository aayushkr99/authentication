
const express = require('express')
const app = express()
const config= require("./src/config/config.json")
const sequelize = require("./src/database/connection");
const route = require("./src/routes/route")


app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
            return res.status(200).json({});
        }
        next();
    });
    
    app.use('/api' , route)

    
    const runServer = async () => {    
        const dbConnect = async () => {
            try {
              await sequelize.sync();
              console.log("DB Connection has been established successfully.");
            } catch (error) {
              console.error("Unable to connect to the database:", error);
              console.log("reconnecting to db .......");
              setTimeout(dbConnect, 10000);
            }
          };
          dbConnect();
    try {
        // creating express server
        app.listen( config.SERVER_PORT, function () {
            console.log(`Express Server running on http://localhost:${config.SERVER_PORT}`);
        });
    } catch (error) {
        console.log('failed to start the server')
    }
}
runServer()

module.exports = app