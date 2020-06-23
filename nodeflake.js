//Load Config
const config = require("./config.js");

//LOGging
const LOG = require("./lib/utils/log.js");


//Load dependencies
const http = require("http");
const url = require("url");
const idworker = require("./lib/idworker.js");

//Startup Info
LOG.info('NodeFlake Server running on port ' + config.port);
LOG.info('Data Center Id:' + config.dataCenterId);
LOG.info('     Worker Id:' + config.workerId);

//Local variables
var worker = idworker.getIdWorker(config.workerId, config.dataCenterId);

http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true);
  if (req.url.indexOf("favicon") > -1) {
    res.writeHead(404, {'Content-Type':'text/plain'});
    res.end("Not Found");
  } else {
    res.writeHead(200, {
      'Content-Type' : 'text/javascript',
      'Cache-Control': 'no-cache',
      'Connection'   : 'close'
    });
    function wrappedResponse(responseString) {
      if (urlObj.query["callback"]) {
        return urlObj.query["callback"] + "(" + responseString + ");";
      } else {
        return responseString;
      }
    }
    try {
      var nextId = worker.getId(req.headers['user-agent']);
      res.end(wrappedResponse("{\"id\":\"" + nextId + "\"}"));
    } catch(err) {
      LOG.error("Failed to return id");
      res.end(wrappedResponse("{\"err\":" + err + "}"));
    }
  }
}).listen(config.port);
