const db = require("../models")
const path = require("path");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const { response } = require("express");
const flash = require("express-flash");
const axios = require("axios")

// HTML Routes ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = (app) => {
    app.get("/", (req, res) => {
        req.user = "";
        const errors = req.flash().error || [];
        //render handlebar with errors passed in... from flash once handlebar is created
        res.sendFile(path.join(__dirname, "../public/login.html"))
        // res.render("login.", {message: flash("message")});
    });

    app.get("/user_id", isAuthenticated, (req, res) => {
        const exphbs = require('express-handlebars');

        app.engine('handlebars', exphbs({
            defaultLayout: '_user'
        }));
        app.set('view engine', 'handlebars');

        //change friends to find all where id = req.user.id (friends of person who is logged in)
        db.Posts.findAll({where: {UserId: req.user.id}}).then((posts) => {
            db.Friends.findAll({where : {UserId: req.user.id}}).then((friends) => {
                res.render('user', {
                    posts: posts,
                    friends: friends})
                    console.log({
                        posts: posts,
                        friends: friends})
            })
        })

        /*  // Import routes and give the server access to them.
        const routes = require('../controllers/user_controller');

        app.use(routes); */ 
    });

    app.get("/home_id", isAuthenticated, (req, res) => {
        console.log("home page hit!")
        const exphbs = require('express-handlebars');

        app.engine('handlebars', exphbs({
            defaultLayout: '_home'
        }));
        app.set('view engine', 'handlebars');

        //do a findAll posts, then pass result as object into render
        db.Posts.findAll().then((result) => {
            res.render('home', {result: result})
            console.log({result: result})
        })
    });

    app.get("/getcity/", isAuthenticated, (req, res) => {
        let city = req.body.city;
        let data = db.Posts.findAll().then((result) => {

            console.log({result: result})
        })
        let weath = axios.get("https://api.openweathermap.org/data/2.5/weather?q=" + "Tokyo" + "&appid=88d9e018c72362777892f1fbbbb2dfb3")
        .then((response) => {
            
        })
        let allInfo = {
            city: city,
            weather: weather,
            posts: data
        }
        res.render('home', allInfo)
    })

    app.get("/friends", isAuthenticated, (req, res) => {
        console.log("friends page hit!")
        const exphbs = require('express-handlebars');

        app.engine('handlebars', exphbs({
            defaultLayout: '_friends'
        }));
        app.set('view engine', 'handlebars');

        //change to db.Friends.findAll
        db.Users.findAll().then((result) => {
            res.render('friends', {result: result})
        })
    });

    app.get("/user/:id", isAuthenticated, (req, res) => {
        const exphbs = require('express-handlebars');

        app.engine('handlebars', exphbs({
            defaultLayout: '_user'
        }));
        app.set('view engine', 'handlebars');
        
        
        var id = req.params.id;
        db.Users.findOne({where: {id: id}}).then((User) => {
            db.Posts.findAll({where: {UserId: id}}).then((Posts) => {
                db.Friends.findAll({where: {UserId: id}}).then((Friends) => {
                    res.render("user", {
                        user: User,
                        posts: Posts,
                        friends: Friends
                    })
                })
            })
            
            
        })
    })
}