const express = require('express')
const router = express.Router();
//var bodyParser = require('body-parser');
const controller = require('../controllers/c_folo6');

//Dirección para mostrar el formulario donde se llena una nueva solicitud de folo 6
router.get('/', (req, res) => {
    controller.getDepartmentList(req, res);
});
//Cuando se hace refrencia a esta dirección, está redirecciona a la pantalla del folo con la posibilidad de editar los datos que el usuario ha ingresado previamente 
router.get('/edit/:id', (req, res) => {
    console.log("Solicito editar el folo con id: " + req.params.id);
    var id = parseInt(req.params.id);
    controller.foloInfoById(req, res);
});
//Esta información muestra como texto cada uno de los atributos del folo
//****ESTA PENDIENTE DE AGREGAR EL ENVIO DE LAS DIRECCIONES Y LUGARES FRECUENTES
router.get('/get/:id', (req, res) => {
    console.log("Solicito información el folo con id: " + req.params.id);
    controller.foloToString(req, res);
});
//****ESTA PENDIENTE DE AGREGAR EL ENVIO DE LAS DIRECCIONES Y LUGARES FRECUENTES
router.post('/getinfo', (req, res) => {
    console.log("Solicito información el folo con id: " + req.body.id_folo);
    controller.foloInfo(req).then(folo => {
        console.dir(folo)
        res.send({
            folo: folo
        });
    });
});
//Ruta para guardar los datos del folo sin incluir los datos de las direcciones y lugares frecuentes. 
//Con respecto a las direcciones y lugares, acá se envían: 
//En el caso de las direcciones se manda únicamente los id de las direcciones puesto que, ha este punto ya fueron creadas; 
//en el caso de los lugares fercuentes estos ya fueron creados previamente
router.post('/add', (req, res) => {
    try {
        controller.createFolo6(req, res);
    } catch (err) {
        res.send({
            title: "Error en el enlace de guardado",
            message: "Ocurrio un error mientras se guardaban los datos, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
            type: 1
        });
        console.log(err);
    }
});
//Dirección a la que se envían los datos lueo de ser modificados por el usuario 
router.post('/edit', (req, res) => {
    try {
        controller.editFolo6(req, res);
    } catch (err) {
        res.send({
            title: "Error en el enlace de actualizado",
            message: "Ocurrio un error mientras se actualizaban los datos, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
            type: 1
        });
        console.log(err);
    }
});
//Dirección a la que se llama para el eliminar el folo que contenga el id indicado
router.post('/delete/:id', (req, res) => {
    try {
        controller.deleteFolo(req, res);
    } catch (err) {
        res.send({
            title: "Error en las rutas de eliminado",
            message: "Ocurrio un error mientras se eliminaban los datos, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
            type: 1
        });
    }
});
//****MODIFICAR PARA QUE SE RECIBAN SOLO LOS FOLOS CORRESPONDIENTES AL USUARIO EN SESIÓN
//Manda a traer los folos ingresados en un formato que el data table pueda renderizar

router.get('/folos', (req, res) => {
    controller.getList(req, res);
});
/*Sin ruta inicial /solicitud_nueva */

//RUTAS PARA DIRECCIONES Y PDF
router.get('/add', (req, res) => {
    controller.getDepartmentList(req, res);
});
//Dirección que genera el pdf

router.post('/showPDF', (req, res) => {
    controller.showAndcreatePDF(req, res);
});

router.post('/showPDF_Folo13', (req, res) => {
    controller.showAndcreatePDF_Folo13(req, res);
});

router.post('/deletePlacesContainer', (req, res) => {
    controller.deletePlacesContainer(req, res);
});

router.post('/createPlacesContainer', (req, res) => {
    controller.createPlacesContainer(req, res);
});

router.post('/esDiaHabil', (req, res) => {
    controller.esDiaHabil(req, res);
});

router.post('/esHoraHabil', (req, res) => {
    controller.esHoraHabil(req, res);
});
module.exports = router;