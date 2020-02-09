const express = require('express');
const router = express.Router();
const controller = require('../controllers/c_direccion');
const {
    body
} = require('express-validator');

//Obtiene listado de direcciones.
router.get('/', (req, res) => {
    controller.getList(req, res);
});

//Muestra formulario de agregar y obtiene el listado de los departamentos
router.get('/add', (req, res) => {
    controller.getDepartmentList(req, res);
});

//Obtiene los municipios del departamento seleccionado
router.get('/getMunicipios', (req, res) => {
    controller.getMunicipiosByDepartamento(req, res);
});

//Crea dirección en la base de datos.
router.post('/add', (req, res) => {
    controller.createAddress(req, res);
});

//Elimina la dirección a través del ícono.
router.post('/delete', (req, res) => {
    controller.deleteAddress(req, res);
});

//Elimina todas las direcciones creadas al salirse del folo.
router.post('/deleteList', (req, res) => {
    controller.deleteAddressList(req, res);
});

module.exports = router;