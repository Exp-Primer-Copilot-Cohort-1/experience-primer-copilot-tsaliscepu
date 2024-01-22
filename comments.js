// Create web server
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create database connection
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'comments'
});

connection.connect(function(err) {
	if (err) {
		console.error('Error connecting: ' + err.stack);
		return;
	}

	console.log('Connected as id ' + connection.threadId);
});

// Create web server
var server = http.createServer(function(req, res) {
	console.log('Request received');
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
});

server.listen(8080);
console.log('Server started');

// Create routes
app.get('/', function(req, res) {
	res.send('Hello World!');
});

app.get('/comments', function(req, res) {
	connection.query('SELECT * FROM comments', function(err, rows, fields) {
		if (err) throw err;

		res.json(rows);
	});
});

app.post('/comments', function(req, res) {
	var post = req.body;

	connection.query('INSERT INTO comments SET ?', post, function(err, result) {
		if (err) throw err;

		res.send('Success');
	});
});

app.get('/comments/:id', function(req, res) {
	connection.query('SELECT * FROM comments WHERE id = ?', req.params.id, function(err, rows, fields) {
		if (err) throw err;

		res.json(rows);
	});
});

app.put('/comments/:id', function(req, res) {
	connection.query('UPDATE comments SET ? WHERE id = ?', [req.body, req.params.id], function(err, result) {
		if (err) throw err;

		res.send('Success');
	});
});

app.delete('/comments/:id', function(req, res) {
	connection.query('DELETE FROM comments WHERE id = ?', req.params.id, function(err, result) {
		if (err) throw err;

		res.send('Success');
	});
});

app.delete('/comments', function(req, res) {
	connection.query('DELETE FROM comments', function(err, result) {
		if (err) throw err;

		res.send('Success');
	});
});

// Start listening
app.listen(3000, function()