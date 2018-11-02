'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
// const Factory = require('./Factory');
// const router = require('./routes');
// DB Setup
const {
    Pool
} = require('pg');
// Heroku pool
let useSSL = false;
let local = process.env.LOCAL || false;
useSSL = true;

// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres@127.0.0.1:5432/app';
const pool = new Pool({
    connectionString,
    ssl: useSSL
});
// const factoryInstance = Factory(pool);
// const route = router(factoryInstance);
// app use
app.use(session({
    secret: 'Tshimugaramafatha',
    cookie: {
        maxAge: 60000
    }

}));
app.use(flash());
app.use('/', express.static(__dirname + '/public'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');



app.get('/', ((req, res) => {
    console.log(req.session)

    if (req.session.username) {
        res.render('logged', {
            username: req.session.username
        })

    } else {
        res.render('login');
    }

}));



app.get('/login', ((req, res) => {
    console.log(req.session)
    let state = {
        userpass: false,
        username: false
    };

    let currentUsername = req.query.username;
    let currentUserpass = req.query.userpass;

    console.log('Current username :' + currentUsername);
    // req.session will be defined now
    if (currentUsername && !req.session.username) {
        //set a session value from a form variable
        req.session.username = currentUsername;
        state.username = true;
    }
    console.log(req.session.username);

    res.render('logged', {
        currentUsername: req.session.username
    }); // res.redirect('/')

}))

app.get('/logout', ((req, res) => {
    delete req.session.username;
    res.redirect('/');
}));










const PORT = process.env.PORT || 5000;
//FIRE TO THE SERVER 

app.listen(PORT, function () {
    console.log('Login app running on port : ', PORT)
});