var express = require('express');

var app = express();

app.use(express.json());
/*
app.get('/', function (req, res) {
    res.send('Hello World!');
  });*/
app.post('/test.json', function(request, response){
  console.log(request.body);      // your JSON
   response.send(request.body);    // echo the result back
});

app.listen(8080);