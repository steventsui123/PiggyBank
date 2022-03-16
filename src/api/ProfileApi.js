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

//get all info
app.post("/get_info", (req,res) => {
    const searchingID = req.body.searchingID

    db_user.query("SELECT * FROM user WHERE user_id = ?;",
    searchingID, (err, result) => {
        res.send(result)
    })
})

app.post("/get_payee", (req, res) =>{
    const searchingID = req.body.searchingID

    db_user.query("SELECT payee_id, payee_name FROM payee WHERE user_id = ?;",
    searchingID, (err, result) =>{
        res.send(result)
    })
})

//check payee registered
app.post("/check_payee", (req, res) =>{
    const user_id_checkpayee = req.body.user_id_checkpayee
    const check_payee_id = req.body.check_payee_id

    db_user.query("SELECT payee_id FROM payee WHERE (user_id = ?) AND (payee_id = ?);",
    [user_id_checkpayee, check_payee_id], (err, result) =>{
        res.send(result)
    })
})

//add payee
app.post("/add_payee", (req,res) =>{
    const user_id_addpayee = req.body.user_id_addpayee
    const add_payee_id = req.body.add_payee_id
    const add_payee_name = req.body.add_payee_name

    db_user.query("INSERT INTO payee (user_id, payee_id, payee_name) VALUES (?,?,?);",
    [user_id_addpayee, add_payee_id, add_payee_name])
})

//delete payee
app.post("/delete_payee", (req, res) =>{
    const user_id_deletepayee = req.body.user_id_deletepayee
    const payee_id = req.body.payee_id

    db_user.query("DELETE FROM payee WHERE `payee_id` = ? AND `user_id` = ?;",
    [payee_id, user_id_deletepayee], (err, result) =>{
        res.send(result)
    })
})

//check user existed
app.post("/check_user", (req, res) =>{
    const payee_id_checkuser = req.body.payee_id_checkuser

    db_user.query("SELECT user_id FROM user WHERE user_id = ?;",
    payee_id_checkuser, (err,result) =>{
        res.send(result)
    })
    
})

//enable 2FA
app.post("/enable_2FA", (req, res) => {
    const user_id_enable2FA = req.body.user_id_enable2FA
    db_user.query("UPDATE user SET `2FA` = 1 WHERE user_id = ?;", user_id_enable2FA)
})

//disable 2FA
app.post("/disable_2FA", (req, res) => {
    const user_id_disable2FA = req.body.user_id_disable2FA
    db_user.query("UPDATE user SET `2FA` = 0 WHERE user_id = ?;", user_id_disable2FA)
})

app.listen(3003, ()=>{
    console.log("running server 3003")
})