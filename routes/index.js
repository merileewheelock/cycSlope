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

    var rawData = googleMapsServer.getData(originInput,destinationInput);

    console.log("************************")
    // setTimeout(function(){ 
    //     console.log(mapApiUrl); 
    // }, 5000);
    console.log("************************")

    res.render('index', { 
        title: 'Express',
        message: '',
        loggedin: req.session.loggedin,
        revisited: true,
        mapApiUrl: 'https://maps.googleapis.com/maps/api/staticmap?size=320x320&maptype=terrain&path=enc:kq~lEt~`bOrtD{`@ruFc}A`{EuRthE{CzwIaVp|MmcCvgPqnDfwBiqAdjEod@x|Gk^bbGcoAlgAkhErbBurBlyCua@v_Cq_AnzA_{@fo@qqGro@qgDtqEstD~nEc`Dl_DilAzX~|@fg@~r@ljB_BlyCyg@rv@azBlt@qcFf_Do`HbaEyjFx_CoiChaEaxAhzAas@juCaoFvgAmvCf`C~Jt{C}MhdCcsA|}@cuExqBxOleAg~@hxAjuAj|BuvAttDiw@~oAec@jfAy_DxHkrBvx@s}BreGccDzqG{Gv}ErQjmAqcAvdAsaFrkLw|Gr_Ky~EbrGgzEpqCk|Bt{@c{@t`AtOldDgRfzB}u@zaMe}FpoSqeKtvFwmHffBm\h`OacKdkJqqEndCkgDxaAusBzpCub@dbI{_EnqBx]roAjRxt@wuAjd@omCzDsaBpLe~AfzBmhFdgDuwFxqDgkFz_Pk_OrcC}}CpqEcnN|zJw{Op_O{eRhdK_bK`sJwbc@nrIutH~|OkwRxcNyqJveH}rBffGgrHdnEgnGjaC}_BfKmsBugAi`E|NwgClcFu`PvF{yKnnCinKfvAabCz}FlEv|Qa`O|zB_xQm_Ak_GljCk|B~fAv|@rqCaYdtAa^p~Agg@|gDpsAn}CwfBz}CydA~|BiqAxzBoGrhDnmCfa@}Ynt@pc@d`EyyCl|A`GxKkgBhnB{Sv_IedApd_@}gGldY{kEddGwvAp`Al{AttAj_@le@{VluC_iDxtRo{DvjV{`HjaG_m@lsGm|ChkJg{EpiF_qBfdJwaDdoJe}B`cEqbC~lDyuA|y@byAfdA_e@zoC{bAxzDu_A~oEgnB~yAfW~`@z_A`zBut@hiDiiB`kBugD~nDs{BfkGwhDtoQgwG~{RieFrfHxbGdsNqkCrlNyfFzoCa`BzyDa}@h_LgvA~mJeeC`bQu}Dn}H{`ArhE}Dh{@qkCp_Fi|B~dJ}g@riAcT`@o}CpdD{xBga@g_D`fAmv@llFo{AxvHmbEb}M{mFrcYynMrp^mvLrbJi`BthOuiE|pCaw@jcBvMj_AhlA`aB``A|_HuO`vLEd}JgbEjiKqiEtqFiqC`_HmgE~tH_nJpqCubAgBqpCnqJmrCltH_}@ddBjpAllG~G~_Aru@ngBjBtyCbEjnBbCrdGtHbsH`PlmBrCnn@jt@kGjrGsBnnChw@l|A``EfHvfDrE`bQvJrjQ_Fbl_@iOpcSnI`ai@~MvzAml@fv@}pApk@or@bzCid@xmE`mCz`J~b@~pKur@&key=AIzaSyBNq7VB2xLpcXxs5L81XXZHgzeY_E22dX8'
        // startPoint: req.session.startPoint,
        // endPoint: req.session.endPoint
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
                req.session.username = results.username;
                req.session.email = results.email;
                req.session.id = results.id;
                console.log('++++++++++++++++++++++++++')
                console.log(req.session.id)
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
    var id = req.session.id
    var username = req.session.username;
    var email = req.session.email;
    var password = req.session.password;
    var firstName = req.session.firstName;
    var gender = req.session.gender;
    var selectQuery = "SELECT * FROM userInfo";
    connection.query(selectQuery,[username,email,password,firstName,gender], function(error,results){
        // console.log('++++++++++++++++++++++++++')
        // console.log(results[0].username)
        // console.log('++++++++++++++++++++++++++')

        res.render('profile', {
            loggedin: req.session.loggedin,
            firstName: results[0].firstName,
            email: results[0].email,
            username: results[0].username,
            gender: results[0].gender
        });
    })

});
module.exports = router;