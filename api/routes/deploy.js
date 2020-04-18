var express = require('express');
var router = express.Router();

let { SERVICE_URL } = require("../config");

/* GET home page. */
router.get('/service', function(req, res, next) {
    res.send(SERVICE_URL);
});

module.exports = router;
