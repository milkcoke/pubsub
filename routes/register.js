const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const SALT = 10;

const users = [];

router.get('/', (request, response)=>{
    response.render('register');
});

router.post('/', (request, response)=>{
    const {id, pw, name='anonymous'} = request.body;
    const hashedPassword = bcrypt.hashSync(pw, SALT);
    response.redirect('/index');
    users.push({
        id: id,
        pw: hashedPassword,
        name: name
    });
    console.log('after response but still alive?');
});