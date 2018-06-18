//MODULES INITIALISATION
const express = require('express');
const mongodb = require('mongodb');
const app = express();

//MONGO INITIALISATION
var MongoClient = mongodb.MongoClient;
const URL = 'mongodb://127.0.0.1:27017/urlDB';



//ROUTER HOME
app.get('/', function(req, res) {
    res.render('index', {
        result: "Please enter an URL",
        result2: "Please enter an URL"
    });
});


//GET URLPARAMS FRON INDEX.HTML
app.get('/urlParams', function(req, res) {
    var urlParam = {
        url: req.query.url
    }
    var search = urlParam.url;

    if (!search) {
        res.render('index', {
            result: "Please enter an URL",
            result2: "Please enter an URL"
        });
    } else if (!search.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g)) {
        res.render('index', {
            result: "Please enter an valid URL",
            result2: "Please enter an URL"
        });
    } else {
        MongoClient.connect(URL, function(err, db) {
            if (err) {
                console.log(err)
            } else {
                //INSERT ELEMENTS IN URLS COLLECTION OF THE DATABASE 
                db.collection('urls').insert(urlParam, function(err, data) {
                        db.on('error', function(err) {
                            console.error("connection error;", err);
                        });
                    })
                    //GET ELEMENTS IN URLS COLLECTION OF THE DATABASE AND SHOW THE DATA
                db.collection('urls').find().toArray(function(err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.render('firewall', {
                            result: data,
                        })
                    }
                })
            }
            db.close();
        })

    }
});



// GLOBAL FUNCTION USE ON THE URL POST
function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    } else {
        return null;
    }
}


//POST URL FROM INDEX.HTML
app.post('/url', function(req, res) {

    var check = getHostName(req.body.check);
    let flag = false;

    if (!check) {
        res.render('index', {
            result: "Please enter an URL",
            result2: "Please enter an URL"
        });
    } else {
        MongoClient.connect(URL, function(err, db) {
            if (err) {
                res.send(err);
            } else {
                //GET ELEMENTS IN URLS COLLECTION OF THE DATABASE AND MATCH THE VALUES
                db.collection('urls').find().toArray(function(err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            var url = data[i].url;
                            console.log(url)
                            if (url.includes(check)) {
                                flag = true;
                                break;
                            }
                        }
                        if (flag) {
                            res.render('index', {
                                result: "Please enter an URL",
                                result2: `${check} is blacklisted`
                            });
                        } else
                            res.render('index', {
                                result: "Please enter an URL",
                                result2: `${check} is whitelisted`
                            });
                    }
                })
            }
            db.close();
        })
    }
})

//APPLICATION EXPORT
module.exports = app;