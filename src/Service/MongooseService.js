var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/droneSpaceBar');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    credit: Number    
});

var User = mongoose.model('User', userSchema);

exports.signIn = function(customer, cb) {

    var newUser = new User({
        username: customer.username,
        email: customer.email,
        credit: 100
    });

    User.find({email: customer.email}, function (err, users) {
        if (err) return console.error(err);
        if(users.length === 0)
            newUser.save(function (err, newUser) {
                if (err) return console.error(err);
            });
        cb(users[0] || newUser);
    });
}

exports.addCredit = function(email, credit) {
    User.update({ email: email }, { $set: { credit: credit }}, function(err, res) {
        if (err) return console.error(err);
    });
}


var orderSchema = new mongoose.Schema({
    email: String,
    dish: Object,
    state: String   
});

var Order = mongoose.model('Order', orderSchema);

exports.putOrder = function(email, dish, cb) {


    var newOrder = new Order({
        email: email,
        dish: { name: dish.name, price: dish.price },
        state: "ordered"
    });

    newOrder.save(function (err, order) {
        if (err) return console.error(err);
        cb(order);
    });

}

exports.dishesFind = function(cb) {
    Order.find(function(err, res) {
        if (err) return console.error(err);
        cb(res);
    });
}

exports.updateOrder = function(order, cb) {
    Order.update({ _id: order._id }, { $set: { state: order.state }}, function(err, res) {
        if (err) return console.error(err);
    });

    Order.find({ email: order.email }, function(err, res) {
        if (err) return console.error(err);
        cb(res);
    });
}