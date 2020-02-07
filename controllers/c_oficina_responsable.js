const Sequelize = require('sequelize');
const OficinaResponsable = require('../models/m_oficina_responsable_vehiculo');

class oficina_responsable_controller {
    constructor() {

    }

    /*
    Obtiene el codigo de la oficina responsable por descripcion
    05012019_DD
     */
    async getCodeByDes(description) {
        console.log("Descripcion: " + name)
        var oficina = await OficinaResponsable.findOne({
            where: {
                DescripcionOficinaResponsableVehiculo: description
            }
        });
        console.log("Codigo de oficina: " + oficina.CodigoOficinaResponsableVehiculo);
        return oficina.CodigoOficinaResponsableVehiculo;
    }

    /*
    Obtiene la descripcion de la oficina responsable
    05012019_DD
     */
    async getDescriptionByCode(code) {
        console.log("Codigo de la oficina: " + code)
        var oficina = await OficinaResponsable.findOne({
            where: {
                CodigoOficinaResponsableVehiculo: code
            }
        });
        console.log("Descripcion: " + oficina.DescripcionOficinaResponsableVehiculo);
        return oficina.DescripcionOficinaResponsableVehiculo;
    }

    /*Obtiene el listado de las oficinas responsables de vehiculo*/
    async getList() {
        try {
            var oficinas = await OficinaResponsable.findAll({
                order: Sequelize.literal('DescripcionOficinaResponsableVehiculo')
            });
            console.log(oficinas);
            return oficinas;
        } catch (error) {
            console.log(error);
        }
    }

};

module.exports = new oficina_responsable_controller();