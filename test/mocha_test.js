var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server.js');
var js = require('../read_json')
var fs = require('fs');
var b_parser = require('body-parser')

describe('server', function () {
  before(function () {
    app.listen(8080);
  });

  after(function () {
    app.close();
  });
});

var expect = chai.expect;

chai.use(chaiHttp);

var t_files = [];
var should = chai.should();
describe('Reading files', function() {
describe('Reading contracts from file', function() {
  it('Reads contracts from JSON file.', function(done) {
    js.jsn('./contracts.json', function (err, json_from_file) {

      if(!err)
      t_files = json_from_file;
    });
    if(t_files)
      done();
});
});

describe('Reading operations from file', function() {
it('Reads operations from JSON file.', function(done) {
  js.jsn('./operations.json', function (err, json_from_file) {
    if(!err)
    t_files = json_from_file;
  });
  if(t_files)
    done();
});
});

describe('Reading comission from file', function() {
it('Reads total comission from JSON file.', function(done) {
js.jsn('./comission.json', function (err, json_from_file) {
  if(!err)
  t_files = json_from_file;
});
if(t_files)
done();
});
});
});

describe('Get_tests', function() {
describe('Starting page', function() {
it('Starts page and loads html file.', function(done) {
  chai.request(app).get('/').end(function(err, res) {
    expect(res).to.have.status(200);
    done();
  });
    });
});
describe('Sending contracts to the front', function() {
  it('Sends contract-object to the front.', function(done) {
    chai.request(app).get('/api/contracts').end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
});
});
describe('Sending operations to the front', function() {
it('Sends operations-object to the front.', function(done) {
  chai.request(app).get('/api/operations').end(function(err, res) {
    expect(res).to.have.status(200);
    done();
  });
});
});
describe('Sending comission to the front', function() {
it('Sends comission-object to the front.', function(done) {
chai.request(app).get('/api/comission').end(function(err, res) {
  expect(res).to.have.status(200)
  done();
});
});
});
});

describe('Post_tests', function() {
describe('Adding new contract to file', function() {
it('Adds new contract to file if it exist', function(done) {
  chai.request(app).post('/api/new_contract/').send({
    contracts:
    {
        contract_num:"26252000000900400",
        balance: 1450
    }
  }).end(function(err, res) {
    done();
  });
    });
    it('Adds new contract to file if it exist', function(done) {
      chai.request(app).post('/api/new_contract/').send({
        contracts:
        {
            contract_num:"26252100000900400",
            balance: 250
        }
      }).end(function(err, res) {
        done();
      });
        });
});
describe('Adding contract which exists', function() {
  it('Dont add new contract to file which exist', function(done) {
    chai.request(app).post('/api/new_contract/').send({
      contracts:
      {
          contract_num:"26252000000900400",
          balance: 1450
      }
    }).end(function(err, res) {
      expect(res).to.have.status(500);
      done();
    });
      });
  });
describe('Adding not  valid contract to file', function() {
  it('Dont add new contract to file', function(done) {
    chai.request(app).post('/api/new_contract/').send({
      contracts:
      {
          contract_num:"-2625200000900400",
          balance: 1450
      }
    }).end(function(err, res) {
      expect(res).to.have.status(500);
      done();
    });
      });
  });
describe('Deposit', function() {
  it('Does deposit on server and writes to file', function(done) {
    chai.request(app).post('/api/operation/').send({
      operation:
      {
          card_lim: -50000,
          contract_num:26252000000900400,
          oper_type:"Депозит",
          balance: 11000
      }
    }).end(function (err, res) {
      expect(res).to.have.status(203);
      done();
  });
  });
});
describe('Deposit_wrong', function() {
  it('Dont do deposit on server and writes to file', function(done) {
    chai.request(app).post('/api/operation/').send({
      operation:
      {
          card_lim: -50000,
          contract_num:26252000000900400,
          oper_type:"Депозит",
          balance: -1000
      }
    }).end(function (err, res) {
      expect(res).to.have.status(404);
      done();
  });
  });
});
describe('Withdraw', function() {
  it('Does withdraw on server and writes to file', function(done) {
    chai.request(app).post('/api/operation/').send({
      operation:
      {
          card_lim: -50000,
          contract_num:26252000000900400,
          oper_type:"Снятие",
          balance: 500
      }
    }).end(function (err, res) {
      expect(res).have.status(200);
      done();
  });
  });
});
describe('Withdraw_wrong', function() {
  it('Dont does credit withdraw on debet card', function(done) {
    chai.request(app).post('/api/operation/').send({
      operation:
      {
          card_lim: 0,
          contract_num:26251000000000000,
          oper_type:"Снятие",
          balance: 50000
      }
    }).end(function (err, res) {
      expect(res).have.status(404);
      done();
  });
});
  it('Dont do withdraw on server and writes to file', function(done) {
    chai.request(app).post('/api/operation/').send({
      operation:
      {
          card_lim: -50000,
          contract_num:26252000000900400,
          oper_type:"Снятие",
          balance: -500
      }
    }).end(function (err, res) {
      expect(res).have.status(404);
      done();
  });
  });
  it('Dont does credit withdraw on universal card under credit limit', function(done) {
    chai.request(app).post('/api/operation/').send({
      operation:
      {
          card_lim: -50000,
          contract_num:26252000000000000,
          oper_type:"Снятие",
          balance: 55000
      }
    }).end(function (err, res) {
      expect(res).have.status(404);
      done();
  });
  });
  it('Dont does credit withdraw on credit card under credit limit', function(done) {
    chai.request(app).post('/api/operation/').send({
      operation:
      {
          card_lim: -150000,
          contract_num:26253000000000000,
          oper_type:"Снятие",
          balance: 150000
      }
    }).end(function (err, res) {
      expect(res).have.status(404);
      done();
  });
  });
});
describe('Cancel valid operation', function() {
  it('Cancel operation and removes from file', function(done) {
    chai.request(app).post('/api/cancel_operation/').send({
        operation_cancel:
        {
            contract_num:26252000000900400,
            token:"weewquewiqy343ui12y43iughewriueyoqbewrioe"
        }
    }).end(function (err, res) {
      expect(res).have.status(200);
      done();
  });
  });
});
describe('Cancel wrong token', function() {
  it('Dont cancel operation and removes from file', function(done) {
    chai.request(app).post('/api/cancel_operation/').send({
        operation_cancel:
        {
            contract_num:26252000000900400,
            token:"weewquewiqy343Oi12y43iughewriueyoqbewrioe"
        }
    }).end(function (err, res) {
      expect(res).have.status(404);
      done();
  });
  });
});
describe('Cancel wrong contract number', function() {
  it('Dont cancel operation and removes from file', function(done) {
    chai.request(app).post('/api/cancel_operation/').send({
        operation_cancel:
        {
            contract_num:26252000000900400,
            token:"weewquewiqy343Oi12y43iughewriueyoqbewrioe"
        }
    }).end(function (err, res) {
      expect(res).have.status(404);
      done();
  });
  });
});
describe('Check comission', function() {
  it('Cheks that comission puts on bank number', function(done) {
    chai.request(app).post('/api/operation/').send({
      operation:
      {
        card_lim: -50000,
        contract_num:26252100000000000,
        oper_type:"Снятие",
        balance: 500
      }
    }).end(function (err, res) {
      expect(res).to.have.status(201);
      done();
  });
  });
});
});