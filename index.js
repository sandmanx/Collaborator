var google = require('googleapis');
google.options({proxy: 'http://172.31.1.6:8080/'});
var express= require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
var x;
var user_name;
var youtube = google.youtube({ version: 'v3', auth: 'AIzaSyAoN1RLSoqgf7ujPK-2cfT8pz4qQR1_tvg' });
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var roomname;

http.listen(3000);

app.use(express.static('./Public'));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

app.get('/', function(req,res) {
    res.sendFile(path);
 });
 app.get('/logout',function(req,res){
   console.log("blog");
   res.redirect('http://localhost:3000/login.html');
 })
var path = __dirname + '/login.html';

io.on('connection', function (socket) {
  console.log("user connected");
  socket.on('pause', function() {
    console.log("pasue received");
    io.sockets.in(socket.room).emit('pauseAll');
  });

  socket.on('play', function() {
    console.log("play recieved");
    io.sockets.in(socket.room).emit('playAll');
  });

  socket.on('x', function(data) {
    console.log(data.title + "xxxxx");
    io.sockets.in(socket.room).emit('y', data.title);
  });
  

  socket.on('commonPlaylist', function(data) {
    io.sockets.in(socket.room).emit('commonPlaylistReply', data);
  });
  socket.on('leaveroom',function(room)
  {
    console.log(room)
    socket.room = undefined;
    console.log(socket.room);
    socket.leave(room);
  });

  socket.on('chat message', function(msg){
    io.sockets.in(socket.room).emit('chat message', msg);
  });
  socket.on('room',function(room)
  {
    console.log(socket.room);

    //if(socket.room === undefined)
    //{
    socket.room = room;
    console.log("in frontend");
    console.log(socket.room);
    //if(socket.id==room)
    socket.join(room);
    //}
    //for(room in socket.rooms){
    //if(socket.id !== room) socket.leave(room);}
  })
});

app.post('/index', function(req, res) {
  user_name = req.body.firstname;
  res.redirect('finaltry.html');
});

app.get("/user", function(req, res) {
  res.send(user_name);
});

app.get('/search/:query', function(req, res) {
  console.log(req.params);
  var results = youtube.search.list({part : 'id,snippet', q: req.params.query, maxResults: 25});
  x = results.url.href;
  request({url: x, json: true, proxy :'http://172.31.1.6:8080/'}, function(err, localres, json) {
    if (err) {
      throw err;
    }
    res.send(json.items[0].id.videoId);
  });
});


