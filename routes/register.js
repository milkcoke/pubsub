const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const SALT = 10;


router.get('/', (request, response)=>{
    response.render('register', { title: 'Session-Cookie Test Code & SSE' });
});

// console.log(`global users variable : ${global.users}`);
router.post('/', async (request, response)=>{
    const {id, pw, name='anonymous'} = request.body;
    console.log(`id: ${id}, pw: ${pw}, name:${name}`);

    const hashedPassword = await bcrypt.hash(pw, SALT);
    response.redirect('/');
    global.users.push({
        id: id,
        password: hashedPassword,
        name: name
    });
    console.log('after response but still alive?');
});

module.exports = router;