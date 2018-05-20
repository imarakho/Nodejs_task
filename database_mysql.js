var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "qwerty12345",
  database: "contracts"
});

  con.query("SELECT * FROM contracts", function (err, result) {
    console.log(err);
    console.log(result);
  });