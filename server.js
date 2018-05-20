var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();
var js = require('./read_json')
var mysql = require('mysql');
var axios = require('axios');
var b_parser = require('body-parser');



// http.createServer(function (req, res) {
  // var q = url.parse(req.url, true);
  app.use(b_parser.json());
  app.use(b_parser.urlencoded({ extended: true })); 

  var filename = "./front.html";
  var json;
  js.jsn('./test.json', function (err, json_from_file) {
    if(err) { throw err; }
    console.log(json_from_file);
    json = json_from_file;
  });


  app.get('/', function (req, res) {
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      }  
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      
      //res.write(json,contracts);
      return res.end();
    });
  });

  app.get('/api/contracts/', function (req, res) {
    res.send(json);
  });

  app.post('/api/new_contract/', function (req, res) {
      var obj = req.body.contracts;
      json.contracts.push(obj.contract_num, 
        obj.balance);
      console.log(json);
      /*var obj = JSON.stringify(json) + JSON.stringify(req.body.contracts);
      obj.splice(obj.find(']'),1);
      obj += ']';
      json = obj;*/
      //json = obj;//JSON.parse(json);
     //var obj = JSON.parse(json);
      //json += JSON.stringify(req.body.data);
     //fs.appendFile('test.json', JSON.parse(req.body.data));
      //console.log(json[0]);
  });

  app.post('/api/add_transaction/', function (req, res) {
    res.send(json);
  });

  app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
  });

 // var mysql      = require('mysql');
  /*var connection = mysql.createConnection({
    host     : 'http://localhost:8080',
    user     : 'root',
    password : 'qwerty12345',
   // database : 'contracts'
  });*/

  /*var client = mysql.createClient();
  client.host='http://localhost:8080';
  client.port= '3306';
  client.user='root';
  client.password='qwerty12345';
  client.database='contracts';
  
  client.end();*/
  //connection.connect();
  /*
  connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows[0].solution);
  });*/
  
  //connection.end();