require('dotenv').config()

var mqtt_msg_counter = 0;
var udp_msg_counter = 0;
var coap_msg_counter = 0;


// azure sdk
const clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
const Client = require('azure-iot-device').Client;

// hardcode device for now
const cs = process.env.DEVICE_CS
var azure_client = clientFromConnectionString(cs);
var sendToHub = function (data) {
    let message = new Message(data);
    console.log('will send: ' + JSON.stringify(message))

    azure_client.sendEvent(message, function (err, res) {
        if (err)
            console.log('Message sending error: ' + err.toString());
        else
            if (res)
                console.log('sent to hub: ' + JSON.stringify(message));
    })
}

// coap without security
const coap = require('coap');
const cserver = coap.createServer();

cserver.on('request', function (req, res) {
    console.log('coap request received\n')
    let nodeTime = new Date().toISOString();
    console.log('nodeTime: ' + nodeTime)

    let data = JSON.stringify({
        nodeTime: nodeTime,
        node: req.url.split('/')[1],
        protocol: 'coap',
        temp: req.url.split('/')[3]
    });
    sendToHub(data);
    res.end('message received by telenet coap server\n')
})

cserver.listen(function () {
    console.log('coap server started on port 5683')
})

// mqtt without security
const mqtt = require('mqtt')
var mclient = mqtt.connect(process.env.MQTT_BROKER)

mclient.on('connect', function () {
    mclient.subscribe('mqtt listener started on port 1883');
    mclient.subscribe('presence')
    mclient.publish('presence', 'Hello mqtt')
})

mclient.on('message', function (topic, message) {
    // message is Buffer
    sendToHub(new Message(message.toString()));
    last = 'mqtt';
    mqtt_msg_counter++;
})

// raw udp datagrams
var dgram = require('dgram');
var userver = dgram.createSocket('udp4');
const port = 44123;
userver.on('listening', () => {
    const address = userver.address();
    console.log(`listening to raw udp datagrams at: ${address.address}:${address.port}`);
});

userver.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    userver.close();
});

userver.on('message', function (buffer, rinfo) {
    udp_msg_counter++;
    last = 'udp';
    sendToHub(new Message(buffer.toString()));
    console.log(`server got: ${buffer} from ${rinfo.address}:${rinfo.port}`);
});

userver.bind(port);
