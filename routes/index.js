const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(request, response, next) {
  response.render('index', { title: 'Session-Cookie Test Code & SSE', user: request.user });
});

module.exports = router;
