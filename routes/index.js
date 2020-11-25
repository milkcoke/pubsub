const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(requset, response, next) {
  response.render('index', { title: 'Session-Cookie Test Code & SSE', user: requset.user });
});

module.exports = router;
