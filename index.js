const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/', function (req, res) {
  res.send("Hi!");
});

app.post('/send-to-user', async function (req, res) {

  const sockets = await io.fetchSockets();
  for (const socket of sockets) {
    if (socket.userId == req.body.userId) {
      console.log("user found ", socket.id);
      // console.log(socket.handshake);
      // console.log(socket.rooms);
      // console.log(socket.data);

      //delete
      delete req.body.userId;
      const evt = req.body.event;
      delete req.body.event;

      socket.emit(evt, req.body);
      // socket.join(/* ... */);
      // socket.leave(/* ... */);
      // socket.disconnect(/* ... */);
    }
  }


  res.send(
    { status: "sent" }
  );
})

app.post('/send-to-all', async function (req, res) {

  const evt = req.body.event;
  delete req.body.event;


  io.emit(evt, req.body);

  res.send(
    { status: "sent" }
  );
})



io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected', socket.userId);

  });
  socket.on('identifyUser', function (data) {
    console.log('Setting user id ', data);
    socket.userId = data;
  });
})
server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});