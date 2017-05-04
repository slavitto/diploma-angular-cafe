var mongoose = require('mongoose');
var drone = require('netology-fake-drone-api');
mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost/droneSpaceBar');
mongoose.connect('mongodb://dronespacebar:drone123spacebar@ds125481.mlab.com:25481/heroku_hzsmwmn9');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    credit: Number
});

var User = mongoose.model('User', userSchema);

var orderSchema = new mongoose.Schema({
    email: String,
    dish: Object,
    state: String
});

var Order = mongoose.model('Order', orderSchema);

exports.signIn = function(customer, cb) {

    var newUser = new User({
        username: customer.username,
        email: customer.email,
        credit: 100
    });

    User.find({ email: customer.email }, function(err, users) {
        if (err) return console.error(err);
        if (users.length === 0) {
            newUser.save(function(err, newUser) {
                if (err) return console.error(err);
                cb(newUser);
            });
        } else {
            Order.find({ email: customer.email }, function(err, orders) {
                cb(users[0], orders);
            });
        }
    });
}

exports.addCredit = function(email, credit) {
    User.update({ email: email }, { $set: { credit: credit } }, function(err, res) {
        if (err) return console.error(err);
    });
}

exports.putOrder = function(email, dish, cb) {

    var newOrder = new Order({
        email: email,
        dish: { name: dish.name, price: dish.price },
        state: "ordered"
    });

    newOrder.save(function(err, order) {
        if (err) return console.error(err);
            User.find({ email: email }, (err, res) => {
            if (err) return console.error(err);
            var newCredit = res[0].credit - dish.price;
            User.update({ email: email }, { $set: { credit: newCredit } }, function(err, res) {
                if (err) return console.error(err);
                cb(order, newCredit);
            });
        });
    });
}

exports.dishesFind = function(cb) {
    Order.find(function(err, res) {
        if (err) return console.error(err);
        cb(res);
    });
}

exports.updateOrder = function(order, cb) {

    Order.update({ _id: order._id }, { $set: { state: order.state } }, function(err, res) {
        if (err) return console.error(err);
        Order.find({ email: order.email }, function(err, res) {
            if (err) return console.error(err);
            if(order.state === "served" || order.state === "got difficultes") {
               setTimeout(() => {
                    order.state = "expired";
                    exports.updateOrder(order, cb);
               }, 120000);     
            }
            cb(res);
        });
    });

    if (order.state === "ready") {
        drone
            .deliver()
            .then(() => {
                order.state = "served"
                exports.updateOrder(order, cb);
            })
            .catch(() => {
                order.state = "got difficultes";
                exports.updateOrder(order, cb);
                User.find({ email: order.email }, function(err, res) {
                    if (err) return console.error(err);
                    var refunded = res[0].credit + order.dish.price;
                    User.update({ email: res[0].email }, { $set: { credit: refunded } }, (err) => {
                        if (err) return console.error(err);
                    }); 
                });
            });
    }
}

exports.logOut = function(customer) {

    User.update({ email: customer.email }, { $set: { credit: customer.credit } }, function(err, res) {
        if (err) return console.error(err);
    });

    Order
        .find({
            $and: [{ email: customer.email }, {
                $or: [{ state: 'expired' }, { state: 'served' }, { state: 'got difficultes' }]
            }]

        })
        .remove()
        .exec();
}
