const express = require('express');
const router = express.Router();
const controller = require('../controllers/c_misiones');
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
    body('name', 'Ingrese el nombre de la misión.').not().isEmpty(),
    body('name', 'El nombre debe ser menor a 40 caracteres.').isLength({
        max: 100
    }),
    //Última edición: 03/11/2019 - Axel Hernández
    body('name', 'El nombre debe contener solo caracteres alfanuméricos.').matches(/^[a-zA-Záéíóúü0-9 ]+$/i),
    /* body('detail', 'Ingrese el detalle de la dirección.').not().isEmpty(),
    body('detail', 'El detalle debe ser menor a 250 caracteres.').isLength({
        max: 250
    }),
    body('detail', 'El detalle debe contener solo caracteres alfanuméricos.').matches(/^[a-zA-Záéíóú0-9 ]+$/i),
    body('departamento', 'No seleccionó un departamento.').not().isEmpty(),
    body('municipio', 'No seleccionó un municipio').not().isEmpty() */
], (req, res) => {
    let Misi_id = req.body.Misi_id;
    if (Misi_id) {
        controller.updateMision(req, res);
    } else {
        controller.createMision(req, res);
    }

});

router.get('/eliminar', (req, res) => {
    controller.deleteMisiones(req, res);
});

router.get('/activar', (req, res) => {
    controller.activarMisiones(req, res);
});
module.exports = router;