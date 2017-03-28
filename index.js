/**
 * Created by demarco on 28/03/2017.
 */
var express = require('express')
    , stylus = require('stylus')
    , nib = require('nib')
const bodyParser= require('body-parser')


function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(stylus.middleware(
    { src: __dirname + '/public'
        , compile: compile
    }
))
app.use(express.static(__dirname + '/public'))

var MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/quotes', function (err, database) {
    if (err) return console.log( err)
    db=database
    app.listen(3000, function () {
        console.log('Example app listening on port 3000!')
    })
})

app.get('/', function (req, res) {
    db.collection('quotes').find().toArray(function(err, results) {
        res.render('index',
            { title : 'Home' , quotes: results})
    })
})

app.post('/quotes', (req, res) => {
    console.log("in post")
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})


