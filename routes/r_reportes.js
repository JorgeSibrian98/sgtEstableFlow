const express = require('express')
const router = express.Router();
const ReportesController = require('../controllers/c_reportes');
const {
    body,
} = require('express-validator');

router.get('/', (req, res) => {
    ReportesController.getList(req, res);
});

module.exports = router;