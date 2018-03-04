const express = require("express");
const db = require("./models/db.js");
const formidable = require("formidable");
const objectId = require("mongodb").ObjectID;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.get("/", function(req, res, next) {
    db.getAllCount("liuyanben", function(count) {
        res.render("index", {
            "pageamount": Math.ceil(count / 3),
        });
    });
});
app.get("/du", function(req, res, next) {
    var page = parseInt(req.query.page);
    db.find("liuyanben", {}, { "sort": { "shijian": -1 }, "pageamount": 3, "page": page }, function(err, result) {
        //result是一个对象数组，要返回给ajax 用res.json();
        res.json({ "result": result });
    });
});
app.post("/tijiao", function(req, res, next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields) {
        //写入数据库
        db.insertOne(
            "liuyanben", {
                xingming: fields.xingming,
                liuyan: fields.liuyan,
                shijian: new Date()
            },
            function(err, result) {
                if (err) {
                    res.send({
                        result: -1
                    }); //-1是给Ajax看的
                    return;
                }
                res.json({
                    result: 1
                });
            }
        );
    });
});
app.get("/shanchu", function(req, res, next) {
    var id = req.query.id;
    db.deleteMany("liuyanben", { _id: objectId(id) }, function(err, result) {
        res.redirect("/");
    })
})
app.listen(3000);