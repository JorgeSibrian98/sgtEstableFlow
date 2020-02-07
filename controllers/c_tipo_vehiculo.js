const Sequelize = require('sequelize');
const TipoVehiculo = require('../models/m_tipo_vehiculo');

class tipo_vehiculo_controller {
    constructor() {

    }

    /*
    Obtiene el codigo del tipo de vehiculo
    05012019_DD
     */
    async getTypeByName(tipo) {
        console.log("Tipo: " + tipo)
        var tipoVehiculo = await TipoVehiculo.findOne({
            where: {
                TipoVehiculo: tipo
            }
        });
        console.log("Codigo del tipo: " + tipoVehiculo.CodigoTipoVehiculo);
        return tipoVehiculo.CodigoTipoVehiculo;
    }

    /*
    Obtiene el nombre del tipo de vehiculo
    05012019_DD
     */
    async getNameByType(code) {
        console.log("Codigo del tipo: " + code)
        var tipoVehiculo = await TipoVehiculo.findOne({
            where: {
                CodigoTipoVehiculo: code
            }
        });
        console.log("Tipo de vehiculo: " + tipoVehiculo.TipoVehiculo);
        return tipoVehiculo.TipoVehiculo;
    }

    /*Obtiene el listado de los tipos de vehiculo*/
    async getList() {
        try {
            var Tipos = await TipoVehiculo.findAll({
                order: Sequelize.literal('CodigoTipoVehiculo')
            });
            console.log(Tipos);
            return Tipos;
        } catch (error) {
            console.log(error);
        }
    }

};

module.exports = new tipo_vehiculo_controller();