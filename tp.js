var request = require('request');

request('http://www.modulus.io', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(typeof(body)); // Show the HTML for the Modulus homepage.
    	console.log(body); 
    }
});