'use strict';

// coap without security
const coap = require('coap');
const cserver = coap.createServer();


cserver.on('request', function (req, res) {
    console.log('coap request received: ' + req.url);
    let nodeTime = new Date().toISOString();
    console.log('time stamp: ' + nodeTime);

    var value = (Math.random() * (16 - 15) + 15).toFixed(4);

   res.end(value);
});

cserver.listen(function () {
    console.log('coap server started on port 5683')
});


