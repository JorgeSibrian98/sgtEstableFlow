const express = require('express')
const router = express.Router();
const controller = require('../controllers/c_user');
const unit_controller = require('../controllers/c_unit');
const employee_controller = require('../controllers/c_employee');
const {
    body,
} = require('express-validator');

router.get('/', (req, res) => {
    controller.getList(req, res);
});

router.get('/gestionar', (req, res) => {
    console.log(req.query.selector);
    switch (parseInt(req.query.selector)) {
        case 1: //Selector #1: Unidad
            unit_controller.getSelector(req, res);
            break;
        case 2: //Selector #2 Jefe de unidad
            employee_controller.getSelector(req, res);
            break;
        default:
            controller.getAdd(req, res);
    }
})

router.post('/gestionar', [
    body('first_name', 'Ingrese el nombre del empleado').not().isEmpty(),
    body('last_name', 'Ingrese los apellidos del empleado').not().isEmpty(),
    body('email', 'El correo electrónico no puede estar vacío.').not().isEmpty(),
    body('password', 'Ingrese una contraseña').not().isEmpty(),
    body('password', 'La contraseña debe tener al menos 8 caracteres').isLength({
        min: 8
    }),
    body('email', 'Ingrese una dirección de correo electrónico válido').isEmail(),
], (req, res) => {
    let user_id = req.body.user_id;
    console.log(user_id);
    controller.createOrUpdateUser(req, res);
})

module.exports = router;