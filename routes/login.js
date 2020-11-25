const express = require('express');
const router = express.Router();
const passport = require('passport');


/* GET users listing. */
router.get('/', function(request, response, next) {
  response.render('login.ejs', { title: 'Session-Cookie Test Code & SSE' })
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash : true
}));


module.exports = router;
