const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');
const session = require('express-session');
const webpack = require('webpack');
const cors = require('cors');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const servConfig = require('./servConfig');
const authConfig = require('./authConfig');
const config = require('../webpack.config.dev');

const app = module.exports = express();
const port = 8080;

app.use(express.static('../src'));

app.use(bodyParser.json());
app.use(session({
    secret: servConfig.sessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false, httpOnly: false}
}));


app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('../build'));

var corsOptions = {
    origin: 'http://localhost:8080'
}

app.use(cors());

app.use(function(req, res, next){
//    var allowedOrigins = ['http://localhost:3000']
//    var origin = req.headers.origin
//    if(allowedOrigins.indexOf(origin) > -1){
//        res.setHeader('Access-Control-Allow-Origin', origin)
//    }
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Methods', ['GET','PUT','POST','DELETE']);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
})

const db = massive.connectSync({
    connectionString: "postgres://puprirrmuovopb:61522d021aa9213387ac952d5e4bd3e60862fb98f2d3cf9212db6f753219cdbe@ec2-23-21-220-48.compute-1.amazonaws.com:5432/dfuhk1hpm6bjkj?ssl=true"
});
app.set('db', db);

const compiler = webpack(config);


app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));



//-------Auth0 Calls--------------------------------------------



passport.use('auth0', new Auth0Strategy({
   domain:       authConfig.auth0.domain,
   clientID:     authConfig.auth0.clientID,
   clientSecret: authConfig.auth0.clientSecret,
   callbackURL:  'http://localhost:8080/auth/callback',
    passReqToCallback: true
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    //Find user in database
    db.getUserByAuthId([profile.id], function(err, user) {
      user = user[0];
      if (!user) { //if there isn't one, we'll create one!
        console.log('CREATING USER');
        db.createUserByAuth([profile.id], function(err, user) {
          console.log('USER CREATED', user);
          return done(err, user[0]); // GOES TO SERIALIZE USER
        })
      } else { //when we find the user, return it
        console.log('FOUND USER', user);
        return done(err, user);
      }
    })  
  }
));

//THIS IS INVOKED ONE TIME TO SET THINGS UP
passport.serializeUser(function(userA, done) {
  
  var userB = userA;
    console.log('serializing', userB);
  //Things you might do here :
   //Serialize just the id, get other information to add to session, 
  done(null, userB); //PUTS 'USER' ON THE SESSION
});

//USER COMES FROM SESSION - THIS IS INVOKED FOR EVERY ENDPOINT
//var userC;
passport.deserializeUser(function(userB, done) {
    console.log('deserializing', userB)
  var userC = userB;
  //Things you might do here :
    // Query the database with the user id, get other information to put on req.user
  done(null, userC); //PUTS 'USER' ON REQ.USER
});



app.get('/auth', passport.authenticate('auth0'));


//**************************//
//To force specific provider://
//**************************//
// app.get('/login/google',
//   passport.authenticate('auth0', {connection: 'google-oauth2'}), function (req, res) {
//   res.redirect("/");
// });

app.get('/auth/callback',
  passport.authenticate('auth0', {successRedirect: '/'}), function(req, res) {
    console.log("HIT CALLBACK");
    res.status(200).send(req.user);
})

app.get('/auth/me', function(req, res) {
//    console.log(req.user);
  if (!req.user) return res.sendStatus(404);
  //THIS IS WHATEVER VALUE WE GOT FROM userC variable above. 
    
    return res.status(200).send(req.user);
  
})

app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})



//-------Render html through nodemon--------------------------------------



app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})



//------Database calls----------------------------------------------------

//GET REQUESTS============================================================



app.get('/api/ships', function(req, res){
    db.getAllShips(function(err, ships){
        res.send(ships)
    })
})

app.get('/api/topScores', function(req, res){
    db.getTopScores(function(err, scores){
        res.send(scores)
    })
})

app.get('/api/users', function(req, res){
    db.getUsers(function(err, users){
        res.send(users)
    })
})

app.get('/api/users/:id', function(req, res){
    var userId = req.params.id;
    db.getUserById([userId], function(err, users){
//        console.log(`GOT USER: ${users}`)
        res.send(users)
    })
})

app.get('/api/users/:username/:password', function(req, res){
    var username = req.params.username;
    var password = req.params.password;
    db.loginUser([username, password], function(err, user){
        res.send(user);
    })
})

app.put('/api/userupdate/:id', function(req, res){
    var userId = req.params.id;
    var newData = req.body;
//    console.log(newData);
    db.updateHighscoreAndTotalCoins([userId, newData.highscore, newData.totalcoins], function(err){
        res.send("updated points and coins");
    })
})



app.listen(port, function() {
//  console.log(`Listening on port ${port}`);
});