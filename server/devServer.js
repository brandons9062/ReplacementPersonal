const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');
const session = require('express-session');
const webpack = require('webpack');
const servConfig = require('./servConfig');
const config = require('../webpack.config.dev');

const app = module.exports = express();
app.use(bodyParser.json());
app.use(session({
    secret: servConfig.sessionSecret,
    resave: true,
    saveUninitialized: true
}));
app.use(express.static('../src'));

const db = massive.connectSync({
    connectionString: "postgres://puprirrmuovopb:61522d021aa9213387ac952d5e4bd3e60862fb98f2d3cf9212db6f753219cdbe@ec2-23-21-220-48.compute-1.amazonaws.com:5432/dfuhk1hpm6bjkj?ssl=true"
});
app.set('db', db);

const compiler = webpack(config);
const port = 3000;

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));



//-------Render html through nodemon--------------------------------------



//app.get('*', function(req, res) {
//  res.sendFile(path.join(__dirname, '../public/index.html'))
//})



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




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});