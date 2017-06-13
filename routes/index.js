var express = require('express');
var router = express.Router();
var request = require('request');
var session = require('express-session');
var config = require('../config/config');
var connect = require('connect');
var bcrypt = require('bcrypt-nodejs');
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
    }else{
        message = ''
    }

  res.render('index', { 
    title: 'Express',
    message: message,
    loggedin: req.session.loggedin,
    revisited: false,
    routeCount: '',
    mapApiUrl: '',
    elevationData: '',
    // distance: '',
    // duration: '',
    mapDetails: ''
    });
});

////////////////////////////////////
////////////////POST////////////////
////////////////////////////////////
router.post('/', function(req, res) {
    var originInput = req.body.startPoint;
    var destinationInput = req.body.endPoint;

    console.log("Start point: " + originInput);
    console.log("End point: " + destinationInput);

    //finalDest is a Promise from server.js
    var finalDest = googleMapsServer.getData(originInput,destinationInput);

    // console.log("***********************")
    // console.log(finalDest)
    // console.log("***********************")


    finalDest.then(
        function(mapDetails){
            console.log(mapDetails);
            // res.json(mapDetails);
            // res.json(mapDetails.directionsData.routes[0].legs[0].distance.text)
            console.log("***********************")
            res.render('index', { 
                title: 'Express',
                message: '',
                loggedin: req.session.loggedin,
                revisited: true,
                routeCount: mapDetails.directionsData.routes.length,
                // mapApiUrl: encodeURI(mapDetails.staticMap),
                elevationData: mapDetails.elevationData,
                // distance: mapDetails.directionsData.routes[0].legs[0].distance.text,
                // duration: mapDetails.directionsData.routes[0].legs[0].duration.text,
                mapDetails: JSON.stringify(mapDetails)
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
    var hash = bcrypt.hashSync(password);
    // console.log(username)
    // console.log(email)
    // console.log(password)
    var selectQuery = "SELECT * FROM userInfo WHERE email = ?";
    connection.query(selectQuery,[email], function(error, results){
        console.log('-------------')
        console.log(results);
        if(results.length == 0){
            var insertQuery = "INSERT INTO userInfo (username,email,password,firstName,gender) VALUES (?,?,?,?,?)";
            connection.query(insertQuery,[username,email,hash,firstName,gender], function(error,results){
                // console.log("================");
                // console.log(req.session);
                // console.log("================");
                req.session.username = username;
                req.session.email = email;
                req.session.firstName = firstName;
                // req.session.loggedin = true;
                // currentId = results[0].id;
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
            var match = bcrypt.compareSync(password, results[0].password)
            if (match == true){
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