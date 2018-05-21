var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();
var js = require('./read_json')
var mysql = require('mysql');
var axios = require('axios');
var b_parser = require('body-parser');


  app.use(b_parser.json());
  app.use(b_parser.urlencoded({ extended: true })); 

  var filename = "./front.html";
  var json = new Object();
  json.contracts = [];
  var operations =[];
  var comission = new Object();
  comission.com = 0;

 // console.log(dfgfdg);
  js.jsn('./contracts.json', function (err, json_from_file) {
    if(!err)
    json = json_from_file;
  });

  js.jsn('./operations.json', function (err, json_from_file) {
    if(!err)
    operations = json_from_file;
  });

  js.jsn('./comission.json', function (err, json_from_file) {
    if(!err)
    comission = json_from_file;
  });

  app.get('/', function (req, res) {
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      }  
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });
  });

  app.get('/api/contracts/', function (req, res) {
    res.send(json);
  });

  app.get('/api/operations/', function (req, res) {
      res.send(operations);
  });

  app.get('/api/comission/', function (req, res) {
       res.send(comission);
       fs.writeFile('comission.json', JSON.stringify(comission), (err) => {
        if (err) throw err;
        console.log('comission has been saved!');
      });
   });
  app.post('/api/new_contract/', function (req, res) {
      var obj = req.body.contracts;
      json.contracts.push({contract_num:obj.contract_num, 
        balance:obj.balance});
        fs.writeFile('contracts.json', JSON.stringify(json), (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
  });

  app.post('/api/operation/', function (req, res) {
    var find = json.contracts.indexOf(json.contracts.find(x => x.contract_num === req.body.operation.contract_num));
    
    if(req.body.operation.oper_type === 'Снятие')
    {
      if(Number(json.contracts[find].balance) - Number(req.body.operation.balance) >= req.body.operation.card_lim)
      {
        json.contracts[find].balance = Number(json.contracts[find].balance) - Number(req.body.operation.balance);
      }
      if (Number(json.contracts[find].balance) - Number(req.body.operation.balance) < 0 && req.body.operation.card_lim)
      {
        comission.com += Number(req.body.operation.balance) / 100;
        json.contracts[find].balance -= Number(req.body.operation.balance) / 100;
      }
    }
    else if(req.body.operation.oper_type === 'Депозит')
    {
      json.contracts[find].balance = Number(json.contracts[find].balance) + Number(req.body.operation.balance);
    }
    operations.push({contract_num:req.body.operation.contract_num,
      sum:req.body.operation.balance, oper_type:req.body.operation.oper_type,date:Date()})
      fs.writeFile('operations.json', JSON.stringify(operations), (err) => {
        if (err) throw err;
        console.log('operations has been saved!');
      });
    fs.writeFile('contracts.json', JSON.stringify(json), (err) => {
      if (err) throw err;
      console.log('contracts has been saved!');
    });
});

//token weewquewiqy343ui12y43iughewriueyoqbewrioe
app.post('/api/cancel_operation/', function (req, res) {
  operations = operations.reverse();
  var find = operations.indexOf(operations.find(x => x.contract_num === req.body.operation_cancel.contract_num));
  var find_json = json.contracts.indexOf(json.contracts.find(x => x.contract_num === req.body.operation_cancel.contract_num));
  
  if(operations[find].oper_type === 'Депозит')
    json.contracts[find_json].balance = Number(json.contracts[find_json].balance) - Number(operations[find].sum);
    else
      json.contracts[find_json].balance = Number(json.contracts[find_json].balance) + Number(operations[find].sum);
  //else if(json.contracts[find_json].balance < 0)
//  {
 //   json.contracts[find_json].balance = Number(json.contracts[find_json].balance) + Number(operations[find].sum);
   // comission.com += (Number(json.contracts[find_json].balance) / 100);
  //  json.contracts[find_json].balance = Number(json.contracts[find_json].balance) + (Number(json.contracts[find_json].balance) / 100); 
  //}
  operations.splice(find,1);
  operations = operations.reverse();
  fs.writeFile('operations.json', JSON.stringify(operations), (err) => {
    if (err) throw err;
    console.log('operations has been saved!');
  });
  fs.writeFile('contracts.json', JSON.stringify(json), (err) => {
  if (err) throw err;
  console.log('contracts has been saved!');
  });
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