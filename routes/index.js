var express = require('express');
var router = express.Router();
var request = require('request');
var session = require('express-session');
var config = require('../config/config');
var connect = require('connect');
// var bcrypt = require('bcrypt-nodejs');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: config.sql.host,
    user: config.sql.user,
    password: config.sql.password,
    database: config.sql.database
});
var googleMapsServer = require('./server.js');
var mapApiUrl;
var currentID = 0

/* GET home page. */
router.get('/', function(req, res, next) {
    var message = req.query.msg;
    if (message == 'badEmailRegister'){
        message = 'This email is already in use'
    }

  res.render('index', { 
    title: 'Express',
    message: message,
    loggedin: req.session.loggedin,
    revisited: false,
    mapApiUrl: '',
    elevationData: ''

    });
});

////////////////////////////////////
////////////////POST////////////////
////////////////////////////////////
router.post('/', function(req, res) {
    var originInput = req.body.startPoint;
    var destinationInput = req.body.endPoint;
    // var mapApiUrl;

    console.log("Start point: " + originInput);
    console.log("End point: " + destinationInput);
    
    // console.log("************************")
    // console.log(googleMapsServer.getData(originInput,destinationInput));
    // console.log("************************")

    var finalDest = googleMapsServer.getData(originInput,destinationInput);

    console.log("***********************")
    console.log(finalDest)
    console.log("***********************")

    finalDest.then(
        function(mapDetails){
            console.log("***********************")
            // res.json(mapDetails);
            console.log("***********************")
            res.render('index', { 
                title: 'Express',
                message: '',
                loggedin: req.session.loggedin,
                revisited: true,
                // mapApiUrl: encodeURI(mapApiUrl).split('\\').join('\\')
                // mapApiUrl: encodeURI(mapApiUrl).replace(/\\\//g, "/")
                mapApiUrl: encodeURI(mapDetails.staticMap),
                elevationData: mapDetails.elevationData
            });
        });
});

router.get('/logout', function(req,res){
    req.session.loggedin = false;
    res.redirect('/')
});

router.post('/processRegister', function(req,res){
    // console.log(req.session)
    var username = req.body.username
    var firstName = req.body.firstName
    var email = req.body.email
    var gender = req.body.gender
    var password = req.body.password
    // console.log(username)
    // console.log(email)
    // console.log(password)
    var selectQuery = "SELECT * FROM userInfo WHERE email = ?";
    connection.query(selectQuery,[email], function(error, results){
        console.log('-------------')
        console.log(results);
        if(results.length == 0){
            var insertQuery = "INSERT INTO userInfo (username,email,password,firstName,gender) VALUES (?,?,?,?,?)";
            connection.query(insertQuery,[username,email,password,firstName,gender], function(error,results){
                // console.log("================");
                // console.log(req.session);
                // console.log("================");
                req.session.username = username;
                req.session.email = email;
                req.session.firstName = firstName;
                req.session.loggedin = true;
                res.redirect('/?msg=registered')
            });
        }else{
            res.redirect('/?msg=badEmailRegister')
        };
    });
});
router.post('/processLogin', function(req,res){
    var email = req.body.email
    var password = req.body.password
    var selectQuery = "SELECT * FROM userInfo WHERE email = ?";
    connection.query(selectQuery, [email], function(error,results){
        if(results.length == 1){
            if (password == results[0].password){
                req.session.loggedin = true;
                req.session.username = results[0].username;
                req.session.email = results[0].email;
                req.session.id = results[0].id;
                currentID = results[0].id;
                console.log('++++++++++++++++++++++++++')
                console.log(currentID)
                console.log('++++++++++++++++++++++++++')
                res.redirect('/?msg=loggedin')
            }else{
                res.redirect('/login?msg=badPass')
            }
        }else{
            res.redirect('/login?msg=badEmail')
        }
    });
});
router.get('/profile', function(req,res){
    var id = req.session.id;
    var username = req.session.username;
    var email = req.session.email;
    var password = req.session.password;
    var firstName = req.session.firstName;
    var gender = req.session.gender;
    var selectQuery = "SELECT * FROM userInfo";
    connection.query(selectQuery,[username,email,password,firstName,gender], function(error,results){
        console.log('++++++++++++++++++++++++++')
        console.log(results[0].id);
        console.log('++++++++++++++++++++++++++')
        res.render('profile', {
            loggedin: req.session.loggedin,
            firstName: results[currentID-1].firstName,
            email: results[currentID-1].email,
            username: results[currentID-1].username,
            gender: results[currentID-1].gender
        });
    })
});
module.exports = router;