'use strict';

require('dotenv').config();
const coap = require('coap'),
    server = coap.createServer();

// the default CoAP port is 5683
server.listen(function () {

    var req = coap.request('coap://localhost/temperature');

    req.on('response', function (res) {
        res.pipe(process.stdout)
        res.on('end', function () {
            console.log(+'\n')
            let data = JSON.stringify({
                payload: res.payload.toString()
            });
            sendToHub(data);

            process.exit(0);
        })
    })

    req.end()
});

// azure sdk
const clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
const Client = require('azure-iot-device').Client;

// hardcode device for now
const cs = process.env.DEVICE_CS
var azure_client = clientFromConnectionString(cs);
var sendToHub = function (data) {
    let message = new Message(data);
    console.log('will send: ' + JSON.stringify(message))
/*
    azure_client.sendEvent(message, function (err, res) {
        if (err)
            console.log('Message sending error: ' + err.toString());
        else
        if (res)
            console.log('sent to hub: ' + JSON.stringify(message));
    })
    */
}