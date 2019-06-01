const express = require('express');
const router = express.Router();
const Auth = require('../controller/AuthController');
router.get('/', (req, res, next) => {
  res.json('It\'s working');
});

router.use('/auth', Auth);

module.exports = router;