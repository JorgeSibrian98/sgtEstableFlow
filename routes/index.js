const express = require('express')
const router = express.Router();
const db = require('../dbconfig/conex');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
/* const Employee = require('../models/m_employee'); */
const secret_token = require('../dbconfig/secret_token');
const cookieParser = require('cookie-parser');
const Roles = require('../controllers/c_user_role');
const auth_controller = require('../controllers/c_auth');

var app = express();
const moment = require('moment')

//Constantes para verificar si está logeado y para verificar permisos
const {
    is_logged,
    authorize
} = require('../middleware/auth');

router.get('/home', (req, res) => {
    var username = req.query.usuario;
    console.log("token")
    console.log(req.cookies.token);
    res.render('home.html', {
        username
    });
});

router.get('/logout', (req, res) => {

    auth_controller.log_out(req, res)
});

//Obtiene los datos del usuario
router.get('/userinfo', (req, res) => {
    try {
        const token = auth_controller.decode_token(req.cookies.token);
        var roles = auth_controller.getRolesNames(token)

        res.send({
            user: token.user,
            roles: roles
        });
    } catch (err) {
        console.log(err)
    }
});


module.exports = router;