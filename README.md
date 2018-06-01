# nbiot-gw

super simple and not yet reliable gw that receives (unsecure) raw udp datagrams, coap and mqtt from a device in an nb-iot cellular network and forwards to azure iot hub.  

+-------------+                                 +-------------+                                 +-------------+
|             |<--------- GET value ------------|             |                                 |             |
| coap-device |                                 | coap-client |------------- AMQP ------------->| az iot hub  |
|             |------------ result ------------>|             |                                 |             |
+-------------+                                 +-------------+                                 +-------------+

Use Case 1: a coap client requests to read a value from a CoAP device.
It receives the value and publishes to IoT Hub


**todo:** a generic coap parser and dtls support