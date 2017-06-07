var express = require('express');
var router = express.Router();
var request = require('request');
var session = require('express-session');
var config = require('../config/config');
// var bcrypt = require('bcrypt-nodejs');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: config.sql.host,
    user: config.sql.user,
    password: config.sql.password,
    database: config.sql.database
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/register', function(req,res){
    res.render('register')
});
router.post('/processRegister', function(req,res){
	// console.log(req.session)
    var username = req.body.username
    var email = req.body.email
    var password = req.body.password
    // console.log(username)
    // console.log(email)
    // console.log(password)
    var selectQuery = "SELECT * FROM userInfo WHERE email = ?";
    connection.query(selectQuery,[email], function(error, results){
    	console.log('-------------')
    	console.log(results);
        if(results.length == 0){
            var insertQuery = "INSERT INTO userInfo (username,email,password) VALUES (?,?,?)";
            connection.query(insertQuery,[username,email,password], function(error,results){
       			// console.log("================");
			    // console.log(req.session);
			    // console.log("================");
                req.session.name = username;
                req.session.email = email;
                req.session.loggedin = true;
                res.redirect('/?msg=registered')
            });
        }else{
            res.redirect('/signup?msg=badEmail')
        };
    });
});

router.get('/login', function(req,res){
    res.render('login')
});

router.post('/processLogin', function(req,res){
    var email = req.body.email
    var password = req.body.password
    var selectQuery = "SELECT * FROM userInfo WHERE email = ?";
});

module.exports = router;