<template>
<div>
    <input type="text"  v-model="contract_num_form">
    <br>
    <input type="text" v-model="oper_balance">
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
    <input type="text"  v-model="contract_num_form_cancel">
    <br>
    <input type="text"  v-model="token">
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
            type: "dfsald",
            types: ["cd", "cu", "cc"],
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
        sendMessage: function(val){
            console.log(val);
            this.messages.push(val.toString())
        },
        make_debet: function()
        {
            if (Number(x.balance) - Number(this.oper_balance) < 0)
                this.error = prompt("Error!", "Wrong ammount of money!");
            console.log(Number(x.balance) - Number(this.oper_balance));
        },
        cancel_operation: function()
        {
            var find = this.contracts.indexOf(z => z.contract_num_form_cancel == this.contracts.contract_num);
            console.log(find);
            console.log(this.contracts);
            console.log(this.contract_num_form_cancel);
    
            if(this.token !== "weewquewiqy343ui12y43iughewriueyoqbewrioe" && find == -1)
                this.error = prompt("Error!", "Wrong token or number of contract!");
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
                    console.log(response);
                })
                .catch(function (error) {
                    console.log("FUUUCK!");
                });
            }
        },
        make_operation: function(){
            if((this.oper_type !== "Снятие" && this.oper_type !== "Депозит") || Number(this.oper_balance) <= 0)
                this.error = prompt("Error!", "Wrong type of operation!");
            if (x = this.contracts.find(x => x.contract_num === this.contract_num_form))
            {
                if(x.contract_num.indexOf("26251") === 0)
                    if (Number(x.balance) - Number(this.oper_balance) < 0 && this.oper_type == "Снятие")
                        this.error = prompt("Error!", "Wrong ammount of money!");
                    else
                    {
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
                        console.log("FUUUCK!");
                        });
                    }
                else if(x.contract_num.indexOf("26252") === 0)
                    if (Number(x.balance) - Number(this.oper_balance) < -50000 && this.oper_type == "Снятие")
                        this.error = prompt("Error!", "Credit limit is over!");
                    else
                    {
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
                        console.log("FUUUCK!");
                        });
                    }
                else if(x.contract_num.indexOf("26253") === 0)
                {
                    if (Number(x.balance) - Number(this.oper_balance) <= -150000 && this.oper_type == "Снятие")
                        this.error = prompt("Error!", "Credit limit is over!");
                    if(Number(x.balance) + Number(this.oper_balance) > 0 && this.oper_type == "Депозит")
                        this.error = prompt("Error!", "More money than your credit!");
                    else
                    {
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
                        console.log("FUUUCK!");
                        });
                    }
                }
                else
                    this.error = prompt("Error!", "Wrong type of card!");
        }
            else if(this.contract_num_form.length === 17
             && this.contract_num_form !== "26250111111111111" && this.oper_type === "Депозит")
            {
                error = prompt("Yeah!", "New contract is added!");
                axios.post('http://localhost:8080/api/new_contract/', {
                contracts:
                {
                    contract_num:this.contract_num_form,
                    balance: this.oper_balance
                }
                })
                .then(function (response) {
                console.log(response);
                })
                .catch(function (error) {
                console.log("FUUUCK!");
                });
            }
            else
                this.error = prompt("Error!", "No such card in base!");
        }
    },
    created: function(){
        this.type="12334";
        let self = this;
        axios.get('http://localhost:8080/api/contracts/')
        .then(function (response) {
            console.log(response)
            self.contracts = response.data.contracts;
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