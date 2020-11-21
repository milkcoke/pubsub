const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const express = require('express');
const app = express();
const customRouter = require('./router.js');
const server = http.createServer(app);
const wss1 = new WebSocket.Server({ noServer: true });
const wss2 = new WebSocket.Server({ noServer: true });
const wss3 = new WebSocket.Server({ noServer: true });
 
 
wss1.on('connection', function connection(ws) {
  console.log('wss2 open!');
  ws.on('messsage', function(incomingMessage) {
    console.log(`ws1 : ${incomingMessage}`);
  });
  ws.on('error', error=>{
    console.error(error, '연결 중 오류 발생1');
  });
  ws.on('close', ()=>{
    console.log('socket closed1');
  });
});
 
wss2.on('connection', function connection(ws) {
  console.log('wss2 open!');
  ws.on('messsage', function(incomingMessage) {
    console.log(`ws2 : ${incomingMessage}`);
  });
  ws.on('error', error=>{
    console.error(error, '연결 중 오류 발생2');
  });
  ws.on('close', ()=>{
    console.log('socket closed2');
  });
});
 
wss3.on('connection', function connection(ws) {
  console.log('wss3 open!');
  ws.on('messsage', function(incomingMessage) {
    console.log(`ws3 : ${incomingMessage}`);
  });
  ws.on('error', error=>{
    console.error(error, '연결 중 오류 발생2');
  });
  ws.on('close', ()=>{
    console.log('socket closed3');
  });
});
 
 
app.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;
  console.log(`pathname on App: ${pathname}`);
  console.log('upgrade!!');
  if (pathname === '/foo') {
    wss1.handleUpgrade(request, socket, head, function done(ws) {
      console.log(`ws : ${ws}, request : ${request}`);
      wss1.emit('connection', ws, request);
    });
  } else if (pathname === '/bar') {
    wss2.handleUpgrade(request, socket, head, function done(ws) {
      console.log(`ws : ${ws}, request : ${request}`);
      wss2.emit('connection', ws, request);
    });
  } else if (pathname === '/vladimir'){
    wss3.handleUpgrade(request, socket, head, function done(ws) {
      console.log(`ws : ${ws}, request : ${request}`);
      wss3.emit('connection', ws, request);
    });
  } else {
    console.log(`socket is destroyed!`);
    socket.destroy();
  }
});
 
 
app.listen(3000, ()=>{
  console.log(`server is listening 3000!`);
});
 
app.use('/', customRouter);
 
app.get('/vladimir', (request, response)=>{
  const pathname = url.parse(request.url).pathname;
  console.log(`pathname: ${pathname}`);
  response.status(200).send('vladimir');
  app.emit('upgrade', request);
})
 
module.exports = app;