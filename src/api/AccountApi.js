//.env
require('dotenv').config();
const dbpassword = process.env.DBPASSWORD
const dbuser = process.env.DBUSER
const session_secret = process.env.SESSIONSECRET
const jwt_secret = process.env.JWTTOKEN
const saltRoute = parseInt(process.env.SALT)

//api require
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

//cookie and session require
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//hash require
const bcrypt = require('bcrypt');

//jwt
const jwt = require('jsonwebtoken');

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

//cookie config
app.use(session({
    name: "user",
    secret: session_secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        expires: 120 * 60 * 1000
    }
}));


//mysql connection
const db_user = mysql.createConnection({
    user: dbuser,
    host: "localhost",
    password: dbpassword,
    database: "user"
});


//register
app.post('/register', (req, res) => {

    const email = req.body.email
    const password = req.body.password
    const firstname = req.body.firstname
    const lastname = req.body.lastname

    bcrypt.hash(password, saltRoute, (err, hashedpw) => {
        if (err){
            res.send(err)
        }
        db_user.query("INSERT INTO user (email, password, firstname, lastname) VALUES (?,?,?,?)", 
            [email, hashedpw, firstname, lastname], (err, result) => {
                res.send(err);
        })
    })
})

//check if registered
app.post('/registered', (req,res) => {
    const cemail = req.body.cemail

    db_user.query("SELECT email FROM user WHERE email = ?;",
    cemail, (err, result) => {
        res.send(result)
    })
})


//JWT
const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]
    if (!token){
        res.send("Missing Token.")
    }else{
        jwt.verify(token, jwt_secret, (err, decoded) => {
            if(err){
                res.json({auth: false, message: "Auth Failed"})
            }else{
                res.user_id = decoded.id
                next()
            }
        })
    }
}
app.get("/auth", verifyJWT, (req, res) => {
    res.send("User authed")
})


//check if logged in
app.get("/loggedin", (req, res) => {
    if (req.session.user){
        res.send({loggedIn: true, user: req.session.user})
    }else{
        res.send({loggedIn: false})
    }
})

//login
app.post('/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    db_user.query("SELECT * FROM user WHERE email = ?;", 
            email, (err, result) => {
                if (err){
                    res.send(err);
                }

                if (result.length > 0){
                    bcrypt.compare(password, result[0].password, (err,comparedresult) =>{
                        if (comparedresult){

                            const user_id = result[0].user_id
                            const jwttoken = jwt.sign({user_id}, jwt_secret, {
                                expiresIn: 300,
                            })
                            req.session.user = result;

                            res.json({auth: true, token: jwttoken, result: result});
                        }else{
                            res.json({auth: false});
                        }
                    })
                }else{
                    res.json({auth: false})
                }
        })
    })

//logout
app.get('/logout', function(req, res) {
    req.session.destroy()
 });

//store verification code
 app.post("/store_code", (req,res) => {
    const storeCode = req.body.storeCode
    const storeEmail = req.body.storeEmail

    db_user.query("UPDATE user SET verification = ? WHERE email = ?;", 
    [storeCode, storeEmail], (err, result) => {
        res.send(result);
    })
})

 //check verification code
 app.post("/check_code", (req, res) =>{
    const code = req.body.code

    db_user.query("SELECT * FROM user WHERE verification = ?;", 
    code, (err, result) => {
        if (result.length > 0){
            res.send(true)
        }else{
            res.send(false)
        }
    })
 })

 //change password
 app.post("/change_password", (req, res) => {
    const newpassword = req.body.newpassword
    const targetEmail = req.body.targetEmail

    bcrypt.hash(newpassword, saltRoute, (err, hashednewpw) => {
        const hash = hashednewpw
        if (err){
            res.send(err)
        }else{
        db_user.query("UPDATE user SET password = ? WHERE email = ?;", 
            [hash, targetEmail], (err, result) => {
                res.send(result);
            })
        }
    })
 })

 //check password
 app.post("/check_password", (req, res) => {
    const user_id = req.body.user_id_checkpassword
    const input_password = req.body.input_password

    db_user.query("SELECT password FROM user WHERE user_id = ?;", 
    user_id, (err, result) => {
        bcrypt.compare(input_password, result[0].password, (err,comparedresult) =>{
            if (comparedresult){
                res.send("Check Password Passed")
            }else{
                res.send("Check Password Failed")
            }
        })
    })

 })

 //delete account
 app.post("/delete_account", (req, res) =>{
     const user_id_delteaccount = req.body.user_id_deleteaccount

     db_user.query("DELETE FROM user WHERE user_id = ?;",user_id_delteaccount)
 })



app.listen(3001, ()=>{
    console.log("running server 3001")
})

