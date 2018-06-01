# nbiot-gw

super simple and not yet reliable CoAP-AzureIoTHuB cloud-gw.  

+-------------+                                 +-------------+                                 +-------------+  
|             |<--------- GET value ------------|             |                                 |             |  
| coap-device |                                 | coap-client |------------- AMQP ------------->| az iot hub  |  
|             |------------ result ------------>|             |                                 |             |  
+-------------+                                 +-------------+                                 +-------------+  
  
Use Case 1: a coap client requests to read a value from a CoAP device. It receives the value and publishes to IoT Hub  


**todo:** a generic coap parser and dtls support