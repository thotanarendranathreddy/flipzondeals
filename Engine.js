var express = require('express');
var app = express();
var util = require('util');
var path=require('path');
// Init App
var app = express();  
// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/blog', function(req, res){
	res.sendFile( __dirname + "/" + "blog.html" );
});

app.get('/flipchat', function (req, res) {
    res.sendFile(__dirname + "/" + "flipchat.html");
})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
var io = require('socket.io').listen(server);
var users = [];
var connections = [];

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    util.log('one socket connected: %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect', function (data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        util.log('one socket Disconnected: %s sockets connected', connections.length);
    });
    // Send Message
    socket.on('send message', function (data) {
        if (data !== '') {
            io.sockets.emit('new message', { msg: data, user: socket.username });
        }
    });
    // new useur
    socket.on('new user', function (data, callback) {

        if (data == '') {
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            users.push(socket.username);
            updateUsernames();
        }

    });
    function updateUsernames() {
        io.sockets.emit('get users', users);
    }
});