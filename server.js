var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongooseService = require("./src/Service/MongooseService");

app.set('port', (process.env.PORT || 3000)); //For avoidong Heroku $PORT error

app.use('/', express.static(__dirname));

io.on('connection', function(socket) {

    socket.on('newUser', function(newUser) {
        mongooseService.signIn(newUser, (newCustomer, orders) => {
            io.emit('newCustomer', {customer: newCustomer, orders: orders});
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
            if(order.refund) io.emit('refund', order.refund);
        });
    });

    socket.on('logOut', function(socket) {
        mongooseService.logOut(socket);
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