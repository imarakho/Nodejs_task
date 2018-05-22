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

  //var filename = "./front.html";
  var json = new Object();
  json.contracts = [];
  var operations =[];
  var comission = new Object();
  comission.com = 0;
  
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
    fs.readFile("./front.html", function(err, data) {
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
    
    if(!res.send(json))
      res.sendStatus(500);
  });

  app.get('/api/operations/', function (req, res) {
    if(!res.send(operations))
      res.sendStatus(500);
  });

  app.get('/api/comission/', function (req, res) {
    if(!res.send(comission))
       res.sendStatus(500);
       /*fs.writeFile('comission.json', JSON.stringify(comission), (err) => {
        if (err) throw err;
        console.log('comission has been saved!');
      });*/
   });
  app.post('/api/new_contract/', function (req, res) {
      var obj = req.body.contracts;
      var find = json.contracts.indexOf(json.contracts.find(x => x.contract_num === req.body.contracts.contract_num));
      if(find === -1 && Number(req.body.contract_num) >= 0 && req.body.contract_num.length === 17)
      {
        json.contracts.push({contract_num:obj.contract_num, 
          balance:obj.balance});
          fs.writeFile('contracts.json', JSON.stringify(json), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
            res.send(200);
        });
      }
      else
        res.sendStatus(500);
  });

  app.post('/api/operation/', function (req, res) {
    var find = json.contracts.indexOf(json.contracts.find(x => x.contract_num == req.body.operation.contract_num));
    if(Number(req.body.operation.balance) > 0)
    {
    if(req.body.operation.oper_type === 'Снятие' )
    {
      res.sendStatus(200);
      if(Number(json.contracts[find].balance) - Number(req.body.operation.balance) >= req.body.operation.card_lim)
      {
        json.contracts[find].balance = Number(json.contracts[find].balance) - Number(req.body.operation.balance);
      }
      if (Number(json.contracts[find].balance) - Number(req.body.operation.balance) < 0 && req.body.operation.card_lim)
      {
        comission.com += Number(req.body.operation.balance) / 100;
        json.contracts[find].balance -= Number(req.body.operation.balance) / 100;
        fs.writeFile('comission.json', JSON.stringify(comission), (err) => {
        if (err) throw err;
        console.log('comission has been saved!');
      });
      }
    }
    else if(req.body.operation.oper_type === 'Депозит')
    {
      console.log(find);
      json.contracts[find].balance = Number(json.contracts[find].balance) + Number(req.body.operation.balance);
      res.sendStatus(500);
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
     // return res.end();
    });
  }
  else
      res.sendStatus(404);
});

//token weewquewiqy343ui12y43iughewriueyoqbewrioe
app.post('/api/cancel_operation/', function (req, res) {
  operations = operations.reverse();
  var find = operations.indexOf(operations.find(x => x.contract_num == req.body.operation_cancel.contract_num));
  var find_json = json.contracts.indexOf(json.contracts.find(x => x.contract_num == req.body.operation_cancel.contract_num));
  if(find === -1 || find_json === -1 || req.body.operation_cancel.token !== "weewquewiqy343ui12y43iughewriueyoqbewrioe")
      res.sendStatus(404);
  else
  {
    res.sendStatus(200);
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
  }
});

  app.post('/api/add_transaction/', function (req, res) {
    res.send(json)
  });

  app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
  });

  module.exports = app;