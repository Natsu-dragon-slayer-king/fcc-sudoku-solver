const express = require("express");
const app = express();
require("dotenv").config({path:"./config/config.env"});
app.use(express.json());
app.use(express.static("public"));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

const apiRoutes = require(__dirname + "/routes/routes.js");
apiRoutes(app);

const server = app.listen(process.env["PORT"] || 5000, ()=>{
	console.log(`You're server is up and running on port: ` + server.address().port);
