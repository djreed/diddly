var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use('/', express.static(__dirname + '/client'));
app.use('/assets', express.static(__dirname + '/assets'));
app.get('/', function(req, res){
    res.sendfile(__dirname + '/client/index.html');
});

var WHITE = '#FFFFFF'
var BLACK = '#000000'
var RED = '#FF0000';
var GREEN = '#00FF00';
var GREY = '#555555';

var users = [];

io.on('connection', function(socket){
    var me = false;

    socket.on('new_player', function(user){
        me = user;

        for (var k in users){
            socket.emit('new_player', users[k]);
        }

        users[me.id] = me;
        socket.broadcast.emit('new_player', user);
    });

    socket.on('move_player', function(user){
        users[me.id] = user;
        socket.broadcast.emit('move_player', user);
    });

    socket.on('kill_player', function(enemy){
        //socket.emit('kill_player', enemy)
        socket.broadcast.emit('kill_player', enemy);
    });

    socket.on('disconnect', function(){
        if(!me){
            return false;
        }
        delete users[me.id];
        socket.broadcast.emit('logout', me.id);
    });

});

var PORT = 8080

server.listen(PORT, function(){
    console.log('listening on *:' + PORT);
});
