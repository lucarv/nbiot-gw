'use strict';
require('dotenv').config();

const coap = require('coap'),
    server = coap.createServer();
server.listen(function () {
    console.log('coap listener started')
}); // the default CoAP port is 5683

// management server
// koa and some middleware
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
var Pug = require('koa-pug');
var pug = new Pug({
    viewPath: './views',
    basedir: './views',
    app: app
});
var router = new Router();

// global vars
var device = {
    deviceId: null
};
var urs = 'coap://localhost';
var devices = []; // this should go to redis or rethinkdb

var sendToHub = (id, data) => {

    var azcli = null;
    let message = new Message(data);
    var device = devices.find(o => o.id === id);

    if (device.client === null) {
        console.log('here')
        azcli = clientFromConnectionString(device.cs);
        var index = devices.findIndex(o => o.id === id);
        let newDev = devices[index];
        devices.splice(index, 1);
        newDev.client = azcli;
        devices.push(newDev);
    } else
        azcli = device.client;

    azcli.sendEvent(message, function (err, res) {
        if (err)
            console.log('Message sending error: ' + err.toString());
        else
        if (res)
            console.log('value sent to Iot Hub: ' + JSON.stringify(message));
    })
}

var getDataFromDevice = (id, url) => {

    var req = coap.request(url);
    req.on('response', function (res) {
        res.pipe(process.stdout)
        res.on('end', function () {
            let data = JSON.stringify({
                payload: res.payload.toString()
            });
            sendToHub(id, data);
            //process.exit(0);
        });
    });
    req.end();
}

var getDevice = (devId) => {
    registry.get(devId, function (err, deviceInfo, res) {
        if (err) console.log('Error: ' + err.toString());
        if (res) console.log('Status: ' + res.statusCode + ' ' + res.statusMessage);
        let hostname = connectionString.substring(0, connectionString.indexOf(';'));
        let devcs = hostname + ';DeviceId=' + devId + ';SharedAccessKey=' + deviceInfo.authentication.symmetricKey.primaryKey;
        devices.push({
            id: devId,
            cs: devcs,
            client: null
        });
    });
}

// azure sdk
const iothub = require('azure-iothub');
const connectionString = process.env.CONN_STRING;
const registry = iothub.Registry.fromConnectionString(connectionString);
const clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
const Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

// routing    
router
    .get('/', (ctx, next) => {
        ctx.render('index');
    })
    .get('/config', (ctx, next) => {
        ctx.render('config');
    })
    .post('/config', (ctx, next) => {
        device = ctx.request.body;
        getDevice(device.id)
        ctx.render('value');
    })
    .get('/devices', (ctx, next) => {
        ctx.body = JSON.stringify({
            devices: devices
        });
    })
    .get('/read', (ctx, next) => {
        ctx.render('value');
    })
    .post('/read', (ctx, next) => {
        let url = device.baseUrl + ctx.request.body.valueName;
        console.log(url);
        getDataFromDevice(device.id, url);

        ctx.body = JSON.stringify({
            result: url
        });
    })
    .get('/lastVal', (ctx, next) => {
        ctx.render('lastval', {
            device
        });
    })
    .post('/lastVal', (ctx, next) => {
        ctx.render('value');
    });

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
console.log('mgmt server started');