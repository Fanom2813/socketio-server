const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;
app.get('/', function(req, res) {
   res.send("Hi!");
});

app.post('/send-to-user', function(req, res) {
  res.send("Hi!");
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
server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});