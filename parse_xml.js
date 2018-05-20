var et = require("elementtree");
var tsession = require("temboo/core/temboosession");
var Yahoo = require("temboo/Library/Yahoo/Weather");

var session = new tsession.TembooSession("ACCOUNT_NAME", "APP_NAME", "APP_KEY");
var getWeatherByAddressChoreo = new Yahoo.GetWeatherByAddress(session);

// Instantiate and populate the input set for the choreo
var getWeatherByAddressInputs = getWeatherByAddressChoreo.newInputSet();

// Set inputs
getWeatherByAddressInputs.set_Address("104 Franklin St, New York, NY");

// Run the choreo; on success parse XML response and report key info.
getWeatherByAddressChoreo.execute(
    getWeatherByAddressInputs,
    function(results) {
        var xmlData = et.parse(results.get_Response());
        var condition = xmlData.find("channel/item/yweather:condition");
        var temp = condition.attrib.temp;
        var text = condition.attrib.text;
        console.log("The weather is %s with a temperature of %s.", text, temp);
    },
    // On failure, log errors returned by Temboo.
    function(error) {
        console.log(error.type); 
        console.log(error.message);
    }
);