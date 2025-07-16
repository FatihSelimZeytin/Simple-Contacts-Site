require('dotenv').config();
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const { User, Company, Phone } = require('../models');


sequelize.authenticate()
    .then(() => console.log('✅ DB connection successful'))
    .catch(err => console.error('❌ DB connection failed:', err));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
