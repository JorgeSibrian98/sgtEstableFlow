const express = require('express')
const router = express.Router();
const controller = require('../controllers/c_vehicle');
const {
    body
} = require('express-validator');

/*GET List*/
router.get('/', (req, res) => {
    controller.getList(req, res);
});

/*GET Create
Descripcion: Obtiene la pagina que lista los vehiculos
Parametros: 
    req: Objecto de tipo request
    res: Objecto de tipo response
20062019_DD
*/
router.get('/gestionar', (req, res) => {
    controller.getCreate(req, res);
});

/*POST Create*/
router.post('/gestionar',
    [
        body('code', 'Debe ingresarel código de activo fijo del vehículo').not().isEmpty(),
        body('brand', 'Debe ingresar la marca del vehículo').not().isEmpty(),
        body('plate', 'Debe ingresar le número de matrícula del vehículo').not().isEmpty(),
        body('chassis', 'Debe ingresar el número chasis del vehículo').not().isEmpty(),
        body('vin', 'Debe ingresar el número VIN del vehículo').not().isEmpty(),
        body('model', 'Debe ingresar modelo del vehículo').not().isEmpty(),
        body('engine', 'Debe ingresar número de motor del vehículo').not().isEmpty()
        .isLength({
            min: 10
        }).withMessage('El número del motor debe contener al menos 10 carácteres alfanúmericos'),
        body('state', 'Debe ingresar el estado del vehículo').not().isEmpty(),
        body('office', 'Debe ingresar la oficina responsable del vehículo').not().isEmpty(),
        body('type', 'Debe ingresar el tipo del vehículo').not().isEmpty(),
        body('year', 'Debe ingresar el año del vehículo').not().isEmpty(),
        body('seats', 'Debe ingresar la cantidad de asientos de forma númerica').isInt()
        .not().isEmpty().withMessage('Debe ingresar la cantidad de asientos'),
        body('mileage', 'Debe ingresar kilometraje actual del vehículo').not().isEmpty(),
        body('fuel', 'Debe ingresar el tipo de combustible del vehhículo').not().isEmpty(),
    ], (req, res) => {
        let vehicle_id = req.body.vehicle_id;
        console.log("Para bifurcar en ruta: " + vehicle_id);
        if (vehicle_id) {
            controller.update(req, res);
        } else {
            controller.create(req, res);
        }
    });

router.get('/matricula_:plate',
    (req, res) => {
        const plate = req.params.plate;
        controller.existsResponse(plate, req, res);
    });


/*GET Create
Ruta provisional para modal
*/
/* router.get('/modal', (req, res) => {
    res.render('../views/vehicle/modal.html');
}); */

router.get('/reporteLoteVehicular', (req, res) => {
    controller.reporteLoteVehicular(req, res);
});

//Cambiar esta ruta por un post.
router.get('/reporteIndividual', (req, res) => {
    controller.reporteIndividual(req, res);
});

module.exports = router