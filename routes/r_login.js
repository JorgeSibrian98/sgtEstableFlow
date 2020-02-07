const express = require('express')
const router = express.Router();
const auth_controller = require('../controllers/c_auth');

//Constantes para verificar si está logeado y para verificar permisos
const {
    is_logged,
    authorize
} = require('../middleware/auth');

//router.use(authorize('emp'))

router.get('/', (req, res) => {
    res.render('login.html');
});

router.post('/auth', async (req, res) => {
    try {
        var cod_usuario = req.body.cod_usuario;
        var password = req.body.password;
        if (cod_usuario && password) {
            await auth_controller.log_in(cod_usuario, password, req, res);
        } else {
            res.render('../views/login.html', {
                err_message: 'Usuario o contraseña no han sido ingresados',
                err_title: 'Datos incompletos'
            });
        }
    } catch (err) {
        res.render('../views/login.html', {
            err_message: 'Por favor intente de nuevo, si el error persiste contacte a soporte técnico',
            err_title: 'Ocurrió un error mientras se iniciba la sesión'
        });
    }
});


module.exports = router;