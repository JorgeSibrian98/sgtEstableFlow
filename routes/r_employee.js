const express = require('express')
const router = express.Router();
const controller = require('../controllers/c_employee');
const auth_controller = require('../controllers/c_auth');

const {
    body,
    check,
    validationResult
} = require('express-validator');
/* 
router.get('/empleado/:id',
    (req, res) => {
        const id = req.params.id;
        console.log("Se buscará al empleado con id: " + id);
        controller.findById(id, req, res);
    }); */

//Obtener las información del empleado que está almacenada en el token
router.get('/info', (req, res) => {
    try {
        const token = auth_controller.decode_token(req.cookies.token);
        var user = token.user;
        console.log("Se buscará al usuario: " + user.first_name + " " + user.last_name);
        controller.findById(user, req, res);
    } catch (err) {
        console.log(err)
    }
});


module.exports = router;