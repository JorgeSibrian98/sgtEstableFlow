const frequent_place = require('../models/m_lugares_frecuentes');
const UbicacionesGeograficas = require('../models/m_ubicaciones_geograficas');
const route_controller = require('./c_route');
const Authorize = require('./c_auth');
const querystring = require('querystring');
const {
    validationResult
} = require('express-validator');
var moment = require('moment');
moment.locale("Es-SV");

class frequent_place_controller {

    constructor() {}

    async getFilteredList(req, res) {
        var fplaces;
        try {
            //Cuando se necesita filtrada
            if (parseInt(req.query.filter) !== 0) {
                fplaces = await frequent_place.findAll({
                    where: {
                        IDRuta: req.query.filter
                    },
                    include: [{
                        model: UbicacionesGeograficas,
                        as: 'Departamento',
                        attributes: ['NombreUbicacionGeografica']
                    }, {
                        model: UbicacionesGeograficas,
                        as: 'Municipio',
                        attributes: ['NombreUbicacionGeografica']
                    }],
                });
            } //Caundo se derse ver todos
            else {
                fplaces = await frequent_place.findAll({
                    include: [{
                        model: UbicacionesGeograficas,
                        as: 'Departamento',
                        attributes: ['NombreUbicacionGeografica']
                    }, {
                        model: UbicacionesGeograficas,
                        as: 'Municipio',
                        attributes: ['NombreUbicacionGeografica']
                    }],
                    attributes: ['IDLugarFrecuente', 'NombreLugarFrecuente', 'DetalleLugarFrecuente', 'LugarFrecuenteActivo']
                });
            }
            return res.render('../views/frequent_places/FTable.html', {
                fplaces,
            });
        } catch (error) {
            console.log(error);
        }
    };

    async getList(req, res) {
        try {
            var fplaces = await frequent_place.findAll({
                include: [{
                    model: UbicacionesGeograficas,
                    as: 'Departamento',
                    attributes: ['NombreUbicacionGeografica']
                }, {
                    model: UbicacionesGeograficas,
                    as: 'Municipio',
                    attributes: ['NombreUbicacionGeografica']
                }],
                attributes: ['IDLugarFrecuente', 'NombreLugarFrecuente', 'DetalleLugarFrecuente', 'LugarFrecuenteActivo']
            });
            let rutas = await route_controller.getRouteList();
            return res.render('../views/frequent_places/list.html', {
                fplaces,
                rutas
            });
        } catch (error) {
            console.log(error);
        }
    };

    async getAdd(req, res) {
        try {
            let Departamentos = await this.getDepartmentList();
            let rutas = await route_controller.getRouteList();
            return res.render('../views/frequent_places/add.html', {
                Departamentos,
                rutas
            });
        } catch (error) {
            console.log(error);
        }
    };

    async getDepartmentList() {
        try {
            return await UbicacionesGeograficas.findAll({
                attributes: ['CodigoUbicacionGeografica', 'NombreUbicacionGeografica'],
                where: {
                    CodigoUbicacionGeograficaSuperior: 'ES'
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    async createFrequentPlace(req, res) {
        try {
            const errors = validationResult(req);
            let {
                name,
                detail,
                departamento,
                municipio,
                ruta
            } = req.body;
            if (!errors.isEmpty()) {
                let Departamentos = await this.getDepartmentList();
                let rutas = await route_controller.getRouteList();
                res.render('../views/frequent_places/add.html', {
                    name,
                    detail,
                    departamento,
                    Departamentos,
                    municipio,
                    rutas,
                    ruta,
                    errors: errors.array()
                });
            } else {
                try {
                    const user_session = Authorize.decode_token(req.cookies.token);
                    await frequent_place.create({
                        NombreLugarFrecuente: name,
                        DetalleLugarFrecuente: detail,
                        CodMunicipio: municipio,
                        CodDepartamento: departamento,
                        IDRuta: ruta,
                        CreadoPor: user_session.user.CodigoUsuario
                    });
                    const query = querystring.stringify({
                        title: "Crear exitoso",
                        message: "Lugar Frecuente Almacenado",
                        class: "success"
                    });
                    res.redirect('/lugares_frecuentes?&' + query);
                } catch (errors) {
                    console.log(errors);
                    let error = 'El Lugar de Destino ingresado ya existe.';
                    let Departamentos = await this.getDepartmentList();
                    let rutas = await route_controller.getRouteList();
                    res.render('../views/frequent_places/add.html', {
                        Departamentos,
                        rutas,
                        error,
                    });
                }

            }
        } catch (error) {
            console.log(error);
        }
    }

    async getUpdate(req, res) {
        try {
            let fplace_id = await req.query.fplace_id;
            let place = await frequent_place.findByPk(fplace_id);
            let name = place.NombreLugarFrecuente;
            let true_name = name;
            let detail = place.DetalleLugarFrecuente;
            let municipio = place.CodMunicipio;
            let departamento = place.CodDepartamento;
            let edit = true;
            let ruta = place.IDRuta;
            let rutas = await route_controller.getRouteList();
            let Departamentos = await this.getDepartmentList();
            console.log(name);
            return res.render('../views/frequent_places/add.html', {
                name,
                detail,
                departamento,
                municipio,
                Departamentos,
                edit,
                fplace_id,
                true_name,
                ruta,
                rutas
            })
        } catch (error) {
            console.log(error);
        }

    };
    async updateFrequentPlace(req, res) {
        try {
            const errors = validationResult(req);
            let {
                name,
                detail,
                departamento,
                municipio,
                true_name,
                ruta,
                fplace_id
            } = req.body;
            if (!errors.isEmpty()) {
                let Departamentos = await this.getDepartmentList();
                res.render('../views/frequent_places/add.html', {
                    name,
                    detail,
                    departamento,
                    Departamentos,
                    municipio,
                    fplace_id,
                    ruta,
                    errors: errors.array()
                });
            } else {
                try {
                    const user_session = Authorize.decode_token(req.cookies.token);
                    /* const fecha_mod = moment().utcOffset("-06:00").format("YYYY-MM-DD, h:mm:ss");
                    console.log(fecha_mod); */
                    await frequent_place.update({
                        NombreLugarFrecuente: name,
                        IDRuta: ruta,
                        DetalleLugarFrecuente: detail,
                        CodMunicipio: municipio,
                        CodDepartamento: departamento,
                        ActualizadoPor: user_session.user.CodigoUsuario,
                    }, {
                        where: {
                            IDLugarFrecuente: fplace_id
                        }
                    });
                    const query = querystring.stringify({
                        title: "Actualizado exitoso",
                        message: "Lugar Frecuente Actualizado",
                        class: "success"
                    });
                    res.redirect('/lugares_frecuentes?&' + query);
                } catch (error) {
                    console.log(error);
                    error = 'El Lugar de Destino ingresado ya existe.';
                    let Departamentos = await this.getDepartmentList();
                    let rutas = await route_controller.getRouteList();
                    name = true_name;
                    res.render('../views/frequent_places/add.html', {
                        name,
                        detail,
                        departamento,
                        Departamentos,
                        municipio,
                        rutas,
                        ruta,
                        fplace_id,
                        error
                    });
                }

            }
        } catch (error) {
            console.log(error);
        }
    };

    /* Metodo para dar de baja un lugar frecuente a travez de su id */
    async deleteFrequentPlace(req, res) {
        try {
            let fplace_id = req.query.fplace_id;
            const user_session = Authorize.decode_token(req.cookies.token);
            await frequent_place.update({
                LugarFrecuenteActivo: 0,
                ActualizadoPor: user_session.user.CodigoUsuario,
            }, {
                where: {
                    IDLugarFrecuente: fplace_id
                }
            });
            const query = querystring.stringify({
                title: "Dar de baja exitoso",
                message: "Lugar Frecuente actualizado",
                class: "warning"
            });
            res.redirect('/lugares_frecuentes?&' + query);
        } catch (error) {
            const query = querystring.stringify({
                title: "Error al Actualizar",
                message: "Lugar Frecuento NO actualizado" + error,
                class: "error"
            });
            res.redirect('/lugares_frecuentes?&' + query);
        }
    };
    /* Metodo para Activarun lugar frecuente a travez de su id */
    async activarLugarFrecuente(req, res) {
        try {
            let fplace_id = req.query.fplace_id;
            const user_session = Authorize.decode_token(req.cookies.token);
            await frequent_place.update({
                LugarFrecuenteActivo: 1,
                ActualizadoPor: user_session.user.CodigoUsuario,
            }, {
                where: {
                    IDLugarFrecuente: fplace_id
                }
            });
            const query = querystring.stringify({
                title: "Activar exitoso",
                message: "Lugar Frecuente actualizado",
                class: "success"
            });
            res.redirect('/lugares_frecuentes?&' + query);
        } catch (error) {
            console.log(error);
            const query = querystring.stringify({
                title: "Error al Actualizar",
                message: "Lugar Frecuente NO actualizado" + error,
                class: "error"
            });
            res.redirect('/lugares_frecuentes?&' + query);
        }
    };

    //Gets frequent places list based on the selected municipio
    async getPlacesByMunicipio(req, res) {
        try {
            let selectedMunicipio = req.query.selectedMunicipio;
            let places = await frequent_place.findAll({
                where: {
                    CodMunicipio: selectedMunicipio
                }
            });
            res.send(places);
        } catch (error) {
            console.log(error);
        }
    };
}

module.exports = new frequent_place_controller();