const express = require('express');
const { searchProducts } = require('../controllers/productsController');

const router = express.Router();

router.get('/search', searchProducts);

module.exports = router;