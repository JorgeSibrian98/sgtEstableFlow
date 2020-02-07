const express = require('express');
const router = express.Router();
const controller = require('../controllers/c_procuraduria');
const {
    body
} = require('express-validator');

// Get procuradurías list
router.get('/', (req, res) => {
    controller.getList(req, res);
});

// Display create procuradurías form
router.get('/gestionar', (req, res) => {
    controller.getGestionar(req, res);
});


//Saves edited procuraduría
//Daba error por longitud 40
//06102019_DD
router.post('/gestionar', [
    //Validations
    body('name', 'Ingrese el nombre de la procuraduría.').not().isEmpty(),
    body('name', 'El nombre debe ser menor a 40 caracteres.').isLength({
        max: 100
    }),
    //Última edición: 16/11/2019 - Axel Hernández
    body('name', 'El nombre debe contener solo caracteres alfanuméricos.').matches(/^[a-zA-Záéíóúü0-9 ]+$/i),
    body('detail', 'Ingrese el detalle de la dirección.').not().isEmpty(),
    body('detail', 'El detalle debe ser menor a 250 caracteres.').isLength({
        max: 250
    }),
    body('departamento', 'No seleccionó un departamento.').not().isEmpty(),
    body('municipio', 'No seleccionó un municipio').not().isEmpty()
], (req, res) => {
    let procu_id = req.body.procu_id;
    if (procu_id) {
        controller.updateProcuraduria(req, res);
    } else {
        controller.createProcuraduria(req, res);
    };

});

//Ruta para verificar si el nombre existe
router.post('/procuNameExists', (req, res) => {
    controller.procuNameExists(req, res);
});
module.exports = router;