// raw udp datagrams
var dgram = require('dgram');
var userver = dgram.createSocket('udp4');
const port = 41234;
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
    sendToHub(new Message(buffer.toString()));
    console.log(`server got: ${buffer} from ${rinfo.address}:${rinfo.port}`);
});

userver.bind(port);