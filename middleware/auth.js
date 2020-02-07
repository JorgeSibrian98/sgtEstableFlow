const express = require('express')
const router = express.Router();
const db = require('../dbconfig/conex');
const jwt = require('jsonwebtoken');
/* const Sequelize = require('sequelize');
const Employee = require('../models/m_employee'); */
const secret_token = require('../dbconfig/secret_token');
/* const cookieParser = require('cookie-parser');
var app = express();
const moment = require('moment');
const asyncHandler = require('./async'); */
const querystring = require('querystring');

exports.is_logged = (req, res, next) => {
    console.log("se verificará la sesión")
    //variable local que contendrá el token
    let token;
    //Si existe un token para la sesión actual
    if (req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        console.log("Sesión no válida");
        const query = querystring.stringify({
            session_error: true,
        });
        res.status(301).redirect('/login?' + query)
    } else {
        try {
            //Verificar el token
            console.log('sesión válida')
            const decoded = jwt.verify(token, secret_token);
            console.log("token decodificado:");
            console.dir(decoded)
            next();
        } catch (err) {
            console.log(err)
            console.log("Ocurrio un error, la sesión no es válida")
            const query = querystring.stringify({
                session_error: true,
            });
            res.status(301).redirect('/login?' + query)
        }
    }
}
//roles contiene los codigos de los roles permitidos en ese url 
exports.authorize = (...roles) => {
    return (req, res, next) => {
        try {
            console.log('Verificaremos si posee estos permisos' + roles)
            //Servirá para verificar si el usuario en sesión tiene permisos
            let have_rol = false;
            //Cada codigo de rol asignado será comparado con el o los roles que posee el usuario en sesión      
            let token = jwt.verify(req.cookies.token, secret_token);
            //Roles definidos en las rutas
            roles.forEach((rolDef, j) => {
                //Roles que posee el usuario
                token.roles.forEach((rol, i) => {
                    //Si el rol asignado a la url es igual al rol del usuario, entonces, posee permisos
                    if (rolDef == rol.CodigoPerfil) {
                        have_rol = true;
                    };
                })
            });
            console.log(have_rol)

            if (!have_rol) {
                //Si no, se le redireccionrá a home o a una pantalla donde se le indique que no tiene permisos
                console.log("Ocurrio un error, usuario no tiene permiso para ingresar");
                const query = querystring.stringify({
                    title: "Acesso Denegado",
                    message: "No posee permisos para la vista solicitada",
                    class: "error",
                    icon: "user lock"
                });
                //req.
                res.status(403).redirect('/home?' + query);
            } else {
                //Si posee permisos, se acepta la solicitud
                // console.log(router)
                next();
            }
        } catch (err) {
            console.log(err)
        }
    }
}