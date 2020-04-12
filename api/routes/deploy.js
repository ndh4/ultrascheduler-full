var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/service', function(req, res, next) {
    console.log(process.env.SERVICE_URL);
    res.send(process.env.SERVICE_URL);
});

module.exports = router;
