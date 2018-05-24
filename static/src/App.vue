<template>
<div>
    <i class="material-icons prefix">account_circle</i>
    <input placeholder="contract number" type="text"  v-model="contract_num_form">
    <br>
    <i class="material-icons prefix">attach_money</i>
    <input placeholder="amount of money" type="text" v-model="oper_balance">
    <br>
    <p>
          <select size="1" v-model="oper_type">
            <option disabled></option>
            <option value="Снятие">Снятие</option>
            <option value="Депозит">Депозит</option>
           </select></p>
    <button @click="make_operation()" >Send</button>
   <!-- ловлю данные с експреса и рисую стартовую таблицу-->
    <h3> Отмена операции</h3>
    <i class="material-icons prefix">account_circle</i>
    <input placeholder="contract number" type="text"  v-model="contract_num_form_cancel">
    <br>
    <i class="material-icons prefix">fingerprint</i>
    <input placeholder="token" type="text"  v-model="token">
    <button @click="cancel_operation()" >Cancel</button>
    <h3>Contract table</h3>
    <ul>
            <li v-for="item in contracts">
                Number of contract:
                {{ item.contract_num }}
                <br>
                Balance:
                {{ item.balance }}
            </li>
        </ul>
        <h3> Comission of bank is: {{ comission }}<br>(Bank num:26250111111111111)<br> weewquewiqy343ui12y43iughewriueyoqbewrioe </h3>
    <br>
    <h3>Operations table</h3>
    <ul>
        <li v-for="item in operations">
            Number of contract:
            {{ item.contract_num }}
            <br>
            Sum of operation:
            {{ item.sum }}
            <br>
            Type of operation:
            {{ item.oper_type }}
            <br>
            Date:
            {{ item.date }}
        </li>
    </ul>
    </div>
</template>


<script>

import axios from 'axios'

export default ({
    data: function() {
        return {
            contracts: [],
            operations: [],
            contract_num_form: "",
            contract_num_form_cancel: "",
            token: "",
            oper_type: "",
            oper_balance: "",
            error: "",
            comission: 0,
            x: []
        }
    },
    methods: {
        cancel_operation: function()
        {
            var find = this.contracts.indexOf(contracts => contracts.contract_num == this.contract_num_form_cancel);
            console.log(find);
            if(this.token !== "weewquewiqy343ui12y43iughewriueyoqbewrioe")
                this.error = prompt("Error!", "Wrong token!");
            else
            {
                axios.post('http://localhost:8080/api/cancel_operation/', 
                {
                    operation_cancel:
                    {
                        contract_num:this.contract_num_form_cancel,
                        token:this.token
                    }
                })
                .then(function (response) {
                    this.error = prompt("Success!", "Operation is canceled!");
                })
            }
        },
        make_operation: function(){
            if((this.oper_type !== "Снятие" && this.oper_type !== "Депозит") || Number(this.oper_balance) <= 0)
                this.error = prompt("Error!", "Wrong type of operation!");
            this.x = this.contracts.find(x => x.contract_num === this.contract_num_form)
            if (!isNaN(parseFloat(this.oper_balance)) && Number.isInteger(this.oper_balance) && this.x !== undefined)
            {
                if(this.x.contract_num.indexOf("26251") === 0)
                    if (Number(this.x.balance) - Number(this.oper_balance) < 0 && this.oper_type == "Снятие")
                        this.error = prompt("Error!", "Wrong ammount of money!");
                    else
                    {
                        this.error = prompt("Success!", "Debet operation is maked!");
                        axios.post('http://localhost:8080/api/operation/', {
                        operation:
                        {
                            card_lim: 0,
                            contract_num:this.contract_num_form,
                            oper_type:this.oper_type,
                            balance: this.oper_balance
                        }
                        })
                        .then(function (response) {
                        console.log(response);
                        })
                        .catch(function (error) {
                        console.log(error);
                        });
                    }
                else if(this.x.contract_num.indexOf("26252") === 0)
                    if (Number(this.x.balance) - Number(this.oper_balance) < -50000 && this.oper_type == "Снятие")
                        this.error = prompt("Error!", "Credit limit is over!");
                    else
                    {
                        this.error = prompt("Success!", "Universal operation is maked!");
                        axios.post('http://localhost:8080/api/operation/', {
                        operation:
                        {
                            card_lim: -50000,
                            contract_num:this.contract_num_form,
                            oper_type:this.oper_type,
                            balance: this.oper_balance
                        }
                        })
                        .then(function (response) {
                        console.log(response);
                        })
                        .catch(function (error) {
                        console.log(error);
                        });
                    }
                else if(this.x.contract_num.indexOf("26253") === 0)
                {
                    if (Number(this.x.balance) - Number(this.oper_balance) <= -150000 && this.oper_type == "Снятие")
                        this.error = prompt("Error!", "Credit limit is over!");
                    if(Number(this.x.balance) + Number(this.oper_balance) > 0 && this.oper_type == "Депозит")
                        this.error = prompt("Error!", "More money than your credit!");
                    else
                    {
                        this.error = prompt("Success!", "Credit operation is maked!");
                        axios.post('http://localhost:8080/api/operation/', {
                        operation:
                        {
                            card_lim: -150000,
                            contract_num:this.contract_num_form,
                            oper_type:this.oper_type,
                            balance: this.oper_balance
                        }
                        })
                        .then(function (response) {
                        console.log(response);
                        })
                        .catch(function (error) {
                        console.log(error);
                        });
                    }
                }
                else
                    this.error = prompt("Error!", "Wrong type of card!");
        }
            else if(this.contract_num_form.length == 17
             && this.contract_num_form !== "26250111111111111" && this.oper_type === "Депозит")
            {
                let self = this
                console.log(self);
                axios.post('http://localhost:8080/api/new_contract/', {
                contracts:
                {
                    contract_num:this.contract_num_form,
                    balance: this.oper_balance
                }
                })
                .then(function (response) {
                    this.error = prompt("Yeah!", "New contract is added! THIS");
                    console.log("self contract", self.contracts);
                    self.contracts.push(this.contract_num_form,this.oper_balance);
                })
                .catch(function (error) {
                //this.error = prompt("Error!", "Wrong input!");
                });
            }
            else
                this.error = prompt("Error!", "Wrong input!");
        }
    },
    created: function(){
        this.type="12334";
        let self = this;
        axios.get('http://localhost:8080/api/contracts/')
        .then(function (response) {
            console.log(response)
            self.contracts = response.data.contracts;
            console.log(contracts);
        })
        .catch(function (error) {
            console.log(error);
        });
        axios.get('http://localhost:8080/api/operations/')
        .then(function (response) {
            console.log(response)
            self.operations = response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
        axios.get('http://localhost:8080/api/comission/')
        .then(function (response) {
            console.log(response)
            self.comission = response.data.com;
        })
        .catch(function (error) {
            console.log(error);
        });
    },
  });

  </script>