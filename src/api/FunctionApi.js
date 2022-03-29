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
const db_user = mysql.createConnection({
    user: dbuser,
    host: "localhost",
    password: dbpassword,
    database: "user"
});

app.post("/transfer", (req, res) =>{
    const transfer_payeeID = req.body.transfer_payeeID
    const transfer_payerID = req.body.transfer_payerID
    const transfer_amount = req.body.transfer_amount

    db_user.query("UPDATE user SET balance = balance + ? WHERE user_id = ?;",
    [transfer_amount, transfer_payeeID])
    db_user.query("UPDATE user SET balance = balance - ? WHERE user_id = ?;",
    [transfer_amount, transfer_payerID])
})

app.listen(3004, ()=>{
    console.log("running server 3004")
})