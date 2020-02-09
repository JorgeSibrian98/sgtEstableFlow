const frequent_place = require('../models/m_lugares_frecuentes');
const UbicacionesGeograficas = require('../models/m_ubicaciones_geograficas');
/* const route_controller = require('./c_route'); */
const {
    validationResult
} = require('express-validator');

class frequent_place_controller {

    constructor() {}

    async getFilteredList(req, res) {
        var fplaces;
        try {
            //Cuando se necesita filtrada
            if (parseInt(req.query.filter) !== 0) {
                fplaces = await frequent_place.findAll({
                    where: {
                        route_id: req.query.filter
                    },
                    include: [UbicacionesGeograficas]
                });
            } //Caundo se derse ver todos
            else {
                fplaces = await frequent_place.findAll({
                    include: [UbicacionesGeograficas]
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
                attributes: ['id', 'nombre', 'detalle']
            });

            fplaces.forEach((record) => {
                console.log(record.Municipio.NombreUbicacionGeografica);
                console.log(record.Departamento.NombreUbicacionGeografica);
            })
            /* let rutas = await route_controller.getRouteList(); */
            return res.render('../views/frequent_places/list.html', {
                fplaces,
                /* rutas */
            });
        } catch (error) {
            console.log(error);
        }
    };
    /* async getMunicipiosByDepartamento(req, res) {
        try {
            let selectedDepartamento = req.query.selectedDepartamento;
            let municipios = await municipio_controller.getMunicipios(selectedDepartamento);
            res.send(municipios);
        } catch (error) {
            console.log(error);
        }
    }; */
    /* 
        async getAdd(req, res) {
            try {
                let Departamentos = await department_controller.getList();
                let rutas = await route_controller.getRouteList();
                return res.render('../views/frequent_places/add.html', {
                    Departamentos,
                    rutas
                })
            } catch (error) {
                console.log(error);
            }
        }; */

    /*  async createFrequentPlace(req, res) {
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
                 let Departamentos = await department_controller.getList();
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
                     await frequent_place.create({
                         name,
                         detail,
                         city_id: municipio,
                         department_id: departamento,
                         route_id: ruta,
                     });
                     res.redirect('/lugares_frecuentes');
                 } catch (errors) {
                     console.log(errors);
                     let error = 'El Lugar de Destino ingresado ya existe.';
                     let Departamentos = await department_controller.getList();
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
     } */

    /* async getUpdate(req, res) {
        try {
            let fplace_id = await req.query.fplace_id;
            let place = await frequent_place.findByPk(fplace_id);
            let name = place.name;
            let true_name = name;
            let detail = place.detail;
            let municipio = place.city_id;
            let departamento = place.department_id;
            let edit = true;
            let ruta = place.route_id;
            let rutas = await route_controller.getRouteList();
            let Departamentos = await department_controller.getList();
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
                let Departamentos = await department_controller.getList();
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
                    console.log(req.body.detail);
                    await frequent_place.update({
                        name: name,
                        route_id: ruta,
                        detail: detail,
                        city_id: municipio,
                        department_id: departamento
                    }, {
                        where: {
                            id: fplace_id
                        }
                    });
                    res.redirect('/lugares_frecuentes');
                } catch (error) {
                    console.log(error);
                    error = 'El Lugar de Destino ingresado ya existe.';
                    let Departamentos = await department_controller.getList();
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
    }
 */
    /* 
        async deleteFrequentPlace(req, res) {
            try {
                let fplace_id = req.query.fplace_id;
                console.log(fplace_id);
                await frequent_place.destroy({
                    where: {
                        id: fplace_id
                    }
                });
                res.redirect('/lugares_frecuentes');
            } catch (error) {
                res.redirect('/lugares_frecuentes');
            }
        } */
    //Gets frequent places list based on the selected municipio
    async getPlacesByMunicipio(req, res) {
        try {
            let selectedMunicipio = req.query.selectedMunicipio;
            let places = await frequent_place.findAll({
                where: {
                    Cod_mun: selectedMunicipio
                }
            });
            res.send(places);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new frequent_place_controller();