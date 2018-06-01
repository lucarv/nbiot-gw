'use strict';

// coap without security
const coap = require('coap');
const cserver = coap.createServer();

cserver.on('request', function (req, res) {
    console.log('coap request received\n');
    console.log(req.url)

    let nodeTime = new Date().toISOString();
    console.log('nodeTime: ' + nodeTime);


   res.end('12 ');
});

cserver.listen(function () {
    console.log('coap server started on port 5683')
});

