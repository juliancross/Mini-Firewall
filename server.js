//MODULES INITIALISATION
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')


//EXPRESS INITIALISATION
const app = express();


//ROUTER  --> router.js
const router = require('./router/router');

//MIDDLEWARE INITIALISATION AND APPLICATION SETTINGS 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + 'views'));

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extented: true
}))
app.use(router);


//SERVER PORT
const port = process.env.PORT || 8884;
app.listen(port, function() {
    console.log("Vous êtes sur le port 8884... http://localhost:8884/");

})