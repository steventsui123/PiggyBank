//.env
require('dotenv').config();
const dbpassword = process.env.DBPASSWORD
const dbuser = process.env.DBUSER

//api require
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

//cookie require
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//app use
const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));


//mysql connection
const db = mysql.createConnection({
    user: dbuser,
    host: "localhost",
    password: dbpassword,
    database: "user"
});

app.listen(3003, ()=>{
    console.log("running server 3003")
})

app.post("/get_info", (req,res) => {
    const searchingID = req.body.searchingID

    db.query("SELECT * FROM user WHERE user_id = ?;",
    searchingID, (err, result) => {
        res.send(result)
    })
})

