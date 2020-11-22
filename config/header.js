
//'Keep-Alive': 'timeout=600', 이 값보다 http Server
// server.setTimeOut이 우선함
module.exports = {
    'Content-Type' : 'text/event-stream',
    'Cache-Control' : 'no-cache',
    'Connection' : 'keep-alive',
    'Access-Control-Allow-origin' : '*'
}


