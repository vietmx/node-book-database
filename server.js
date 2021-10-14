// Database Connections

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/firstdb";

// Node Modules
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();

// Initialising Express
app.use(express.static('public'));
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

var db;

// connecting variable db to database
MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    db = client.db('firstdb');
    app.listen(8080);
    console.log('Listening on 8080');
});

// *** GET Routes - display pages ***

// Root Route
app.get('/', function (req, res) {
    res.render('pages/index');
});

// Books Route
app.get('/books', function (req, res) {
    // Find data in books collection
    db.collection('books').find({}).toArray(function (err, result) {
        // Turn array into a JSON string for logging
        console.log("Book Collection: " + JSON.stringify(result));
    // Show books page
    res.render('pages/books', {
            bookdetails: result
        });
    });
});

// *** POST Routes ***

// Add Route
app.post('/add', function (req, res) {
    // Get details from the form
    var bookname = req.body.name;
    var bookgenre = req.body.genre;
    // Format book details into JSON
    var bookdetails = { "name": bookname, "genre": bookgenre };
    // Add book details to book collection
    db.collection('books').insertOne(bookdetails, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.redirect('/books');
    });
});

// Delete Route
app.post('/delete', function (req, res) {
    // Get details from the form
    var bookname = req.body.name;
    // Format book details into JSON
    var bookdetails = { "name": bookname };
    // Add book details to book collection
    db.collection('books').deleteOne(bookdetails, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.redirect('/books');
    });
});

// Edit Route
app.post('/edit', function (req, res) {
    // Get details from the form
    var oldbook = req.body.editname;
    var newbook = req.body.newname;
    // Format book details into JSON
    var bookquery = { "name": oldbook };
    var newbookquery = { $set: {name: newbook } };
    // Add book details to book collection
    db.collection('books').updateOne(bookquery, newbookquery, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.redirect('/books');
    });
});
