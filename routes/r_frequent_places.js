const express = require('express');
const router = express.Router();
const controller = require('../controllers/c_frequent_places');
const {
    body
} = require('express-validator');

router.get('/', (req, res) => {
    if (req.query.filter) {
        controller.getFilteredList(req, res);
    } else {
        controller.getList(req, res);
    }
});

/* router.get('/nuevo', (req, res) => {
    controller.getAdd(req, res);
}); */
/* router.get('/getMunicipios', (req, res) => {
    controller.getMunicipiosByDepartamento(req, res);
}); */
/* router.get('/editar', (req, res) => {
    controller.getUpdate(req, res);
}); */

/* router.post('/gestionar', [
    //Validations
    body('name', 'El nombre debe ser menor a 100 caracteres.').isLength({
        max: 150
    }),
    body('name', 'Ingrese el nombre de la dirección.').not().isEmpty(),

    // body('name', 'El nombre debe contener solo caracteres alfanuméricos.').not().isAlphanumeric(), 
    body('detail', 'El detalle debe ser menor a 150 caracteres.').isLength({
        max: 200
    }),
    // body('detail', 'El detalle debe contener solo caracteres alfanuméricos.').not().isAlphanumeric(), 
    body('departamento', 'No seleccionó un departamento.').not().isEmpty(),
    body('municipio', 'No seleccionó un municipio').not().isEmpty()
], (req, res) => {
    let fplace_id = req.body.fplace_id;
    console.log(fplace_id);
    if (fplace_id) {
        controller.updateFrequentPlace(req, res);
    } else {
        controller.createFrequentPlace(req, res);
    }
}); */

/* router.get('/eliminar', (req, res) => {
    controller.deleteFrequentPlace(req, res);
}); */

//PARA LOS PLACES DEL FOLO 6
router.get('/getPlaces', (req, res) => {
    console.log("Encontre la ruta")
    controller.getPlacesByMunicipio(req, res);
});

module.exports = router;