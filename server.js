var express = require("../server-express/node_modules/express");
var app = express();

var mongo = require("mongodb"),
    Server = mongo.Server,
    Db = mongo.Db;

var server = new Server("localhost", 27017, { auto_reconnect: true });
var db = new Db("exampleDb", server);

// // ВЫВОД СПИСКА
// app.use("/api/contacts/get", (req, res) => {
//     db.open(function(err, db) {
//         db.collection("phoneBook", function(err, collectionref) { 
//             var cursor = collectionref.find();
//             cursor.toArray(function(err, docs) {
//                 var contacts = "";
//                 for (var i = 0; i < docs.length; i++) {
//                     contacts += docs[i].name + " " + docs[i].surname + ", " + docs[i].phone + "<br>";
//                 }
//                 res.writeHead(200, { "Content-Type": "text/html" });
//                 res.write(contacts);
//                 db.close();
//             });
//         });
//     });
// });

app.use('/', express.static(__dirname));
// app.use('/login', express.static('src/login'));
// app.use('/kitchen', express.static('src/kitchen'));

// ДОБАВЛЕНИЕ КОНТАКТА
app.use("/api/contacts/add", (req, res) => {
    if ((!req.query.name) || (!req.query.surname) || (!req.query.phone)) {
        res.status(400).send("Enter name, surname and phone");
    } else {
        db.open(function(err, db) {
            db.collection("phoneBook", function(err, collectionref) {
                var newContact = { "name": req.query.name, "surname": req.query.surname, "phone": req.query.phone };
                collectionref.insert(newContact, function(err, result) {
                    if (!err) {
                        res.status(200).send("Contact " + req.query.name + " " + req.query.surname + " added");
                        db.close();
                    }
                });
            });
        });
    }
});

// // ИЗМЕНЕНИЕ НОМЕРА У КОНТАКТА
// app.use("/api/contacts/newphone", (req, res) => {
//     if ((!req.query.name) || (!req.query.surname) || (!req.query.newphone)) {
//         res.status(400).send("Enter name, surname and new phone number");
//     } else {
//         db.open(function(err, db) {
//             db.collection("phoneBook", function(err, collectionref) { 
//                 collectionref.update(   { name: req.query.name, surname: req.query.surname },
//                                         { name: req.query.name, surname: req.query.surname, phone: req.query.newphone },
//                                         { upsert: true }, function (err, result) {
//                     if(!err)  {
//                         res.status(200).send("Contact " + req.query.name + " " + req.query.surname + " updated");
//                         db.close();
//                     }
//                 });
//             });
//         });
//     }
// });

// //УДАЛЕНИЕ КОНТАКТА
// app.use("/api/contacts/remove", (req, res) => {
//     if ((!req.query.name) || (!req.query.surname)) {
//         res.status(400).send("Enter name and surname");
//     } else {
//         db.open(function(err, db) {
//             db.collection("phoneBook", function(err, collectionref) { 
//                 collectionref.remove({ name: req.query.name, surname: req.query.surname }, function (err, result) {
//                     if(!err)  {
//                         res.status(200).send("Contact " + req.query.name + " " + req.query.surname + " removed");
//                         db.close();
//                     }
//                 });
//             });
//         });
//     }
// });


// // ПОИСК ПО ИМЕНИ, ФАМИЛИИ, ТЕЛЕФОНУ
// app.use("/api/contacts/find/", (req, res) => {
//     db.open(function(err, db) {
//         db.collection("phoneBook", function(err, collectionref) { 
//             if((req.path !== "/name") && (req.path !== "/surname") && (req.path !== "/phone")) {
//                 res.status(400).send("Search path is incorrect");
//             } else {
//                 var keyword = Object.keys(req.query)[0];
//                 var keyname = req.path.replace("/", ""); // не смог преобразовать keyname для запроса!! :((
//                 switch(req.path) {
//                     case "/name"    :       cursor = collectionref.find({ name: keyword });
//                     break;
//                     case "/surname" :       cursor = collectionref.find({ surname: keyword });
//                     break;
//                     case "/phone"   :       cursor = collectionref.find({ phone: keyword });
//                     break;
//                 }
//                 cursor.toArray(function(err, docs) {
//                     if(err) console.log(err);
//                     var contacts = "";
//                     for (var i = 0; i < docs.length; i++) {
//                         contacts += docs[i].name + " " + docs[i].surname + ", " + docs[i].phone + "<br>";
//                     }
//                     res.writeHead(200, { "Content-Type": "text/html" });
//                     res.write(contacts);
//                     db.close();
//                 });
//             }
//         });
//     });
// });


app.use((req, res, next) => {
    res.status(404).send("Path not found");
});

app.use((err, req, res, next) => {
    res.status(500);
    res.render("error", { error: err });
    next(err);
});

app.listen(3000);
