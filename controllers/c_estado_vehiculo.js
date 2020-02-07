const Sequelize = require('sequelize');
const EstadoVehiculo = require('../models/m_estado_vehiculo');

class estado_vehiculo_controller {
    constructor() {

    }

    /*
    Obtiene el codigo del estado de vehiculo
    05012019_DD
     */
    async getCodeByName(estado) {
        console.log("Estado: " + estado)
        var EstadoVehiculo = await EstadoVehiculo.findOne({
            where: {
                EstadoVehiculo: estado
            }
        });
        console.log("Codigo del estado: " + EstadoVehiculo.CodigoEstado);
        return EstadoVehiculo.CodigoEstado;
    }

    /*
    Obtiene el nombre del esatdo del vehiculo
    05012019_DD
     */
    async getNameByCode(code) {
        console.log("Codigo del estado: " + code)
        var estadoVehiculo = await EstadoVehiculo.findOne({
            where: {
                CodigoEstado: code
            }
        });
        console.log("Estado: " + estadoVehiculo.EstadoVehiculo);
        return estadoVehiculo.EstadoVehiculo;
    }

    /*Obtiene el listado de los estados del vehiculo*/
    async getList() {
        try {
            var Estados = await EstadoVehiculo.findAll({
                order: Sequelize.literal('CodigoEstado')
            });
            console.log(Estados);
            return Estados;
        } catch (error) {
            console.log(error);
        }
    }

};

module.exports = new estado_vehiculo_controller();