var coap        = require('coap')
  , server      = coap.createServer()
 
// the default CoAP port is 5683
console.log('send coap request')
  var req = coap.request('coap://localhost/Matteo')
 
  req.on('response', function(res) {
    res.pipe(process.stdout)
    res.on('end', function() {
      process.exit(0)
    })
  });
 
  req.end();
