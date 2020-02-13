const express = require('express');
const router = express.Router();
const controller = require('../controllers/c_route');
const {
    body
} = require('express-validator');

//Muestra listado de rutas
router.get('/', (req, res) => {
    controller.getList(req, res);
});

//Muestra formulario para crear una ruta.
router.get('/gestionar', (req, res) => {
    controller.getGestionar(req, res);
});

//Guarda la ruta en la base de datos.
router.post('/gestionar', [
    //Validaciones
    body('name', 'Ingrese el nombre de la ruta estándar.').not().isEmpty(),
    body('name', 'El nombre debe ser menor a 40 caracteres.').isLength({
        max: 40
    }),
    body('name', 'El nombre debe contener solo caracteres alfanuméricos y el único caracter especial permitido es #.').matches(/^[a-zA-Záéíóúü0-9# ]+$/i),
    body('monday_frequency', 'Ingrese un valor entre 1 y 40 en el día lunes.').isNumeric({ gt: 1, lt: 40 }),
    body('tuesday_frequency', 'Ingrese un valor entre 1 y 40 en el día martes.').isNumeric({ gt: 1, lt: 40 }),
    body('wednesday_frequency', 'Ingrese un valor entre 1 y 40 en el día miércoles.').isNumeric({ gt: 1, lt: 40 }),
    body('thursday_frequency', 'Ingrese un valor entre 1 y 40 en el día jueves.').isNumeric({ gt: 1, lt: 40 }),
    body('friday_frequency', 'Ingrese un valor entre 1 y 40 en el día viernes.').isNumeric({ gt: 1, lt: 40 }),
    body('saturday_frequency', 'Ingrese un valor entre 1 y 40 en el día sábado.').isNumeric({ gt: 1, lt: 40 }),
    body('sunday_frequency', 'Ingrese un valor entre 1 y 40 en el día domingo.').isNumeric({ gt: 1, lt: 40 }),
],
    (req, res) => {
        let route_id = req.body.route_id; //Se extrae el id del cuerpo de la petición
        //Si el id de la ruta existe se mostrará formulario de edición
        if (route_id) {
            console.log("Estoy en el update.");
            controller.updateRoute(req, res);
            //De ser nulo se mostrará el formulario de creación
        } else {
            console.log("Estoy en el create.");
            controller.createRoute(req, res);
        }
    });

//Ruta para verificar si el nombre existe
router.post('/routeNameExists', (req, res) => {
    controller.routeNameExists(req, res);
});

module.exports = router;