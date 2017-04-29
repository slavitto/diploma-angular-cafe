var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongooseService = require("./src/Service/MongooseService");

app.set('port', (process.env.PORT || 3000)); //For avoidong Heroku $PORT error

io.on('connection', function(socket) {
    socket.on('newUser', function(newUser) {
        mongooseService.signIn(newUser, newCustomer => {
            io.emit('newCustomer', newCustomer);
        });
    });

    socket.on('addCredit', function(socket) {
        mongooseService.addCredit(socket.email, socket.credit);
    });

    socket.on('putOrder', function(socket) {
        mongooseService.putOrder(socket.email, socket.dish, newOrder => {
            io.emit('newOrder', newOrder);
        });
    });

    socket.on('cookLogin', function(socket) {
        mongooseService.dishesFind(orders => {
            io.emit('orders', orders);
        });
    });

    socket.on('updateOrder', function(socket) {
        mongooseService.updateOrder(socket, order => {
            io.emit('updatedOrder', order);
        });
    });

    socket.on('clearOrders', function(socket) {
        mongooseService.clearOrders();
    });
});

app.use((req, res, next) => {
    res.status(404).send("Path not found");
});

app.use((err, req, res, next) => {
    res.status(500);
    res.render("error", { error: err });
    next(err);
});

http.listen(app.get('port'));