# nbiot-gw

super simple and not yet reliable gw that receives (unsecure) raw udp datagrams, coap and mqtt from a device in an nb-iot cellular network and forwards to azure iot hub  
right now it only parses coap in the following format: URL + /coap_node_id/temp/temperature_value  

**todo:** a generic coap parser and dtls support