const Sequelize = require('sequelize');
const Descripcion = require('../models/m_descripcion_uso_vehiculo');

class descripcion_uso_vehiculo_controller {
    constructor() {

    }

    /*
    Obtiene el codigo de la descripon de uso del vehiculo
    05012019_DD
     */
    async getCodeByDes(descripcion) {
        console.log("Descripcion: " + estado)
        var descripcionUso = await Descripcion.findOne({
            where: {
                Descripcion: descripcion
            }
        });
        console.log("Codigo de la Descripcion: " + descripcionUso.CodigoDescripcion);
        return descripcionUso.CodigoDescripcion;
    }

    /*
    Obtiene la descripcion de uso del vehiculo
    05012019_DD
     */
    async getNameByCode(code) {
        console.log("Codigo: " + code)
        var descripcionUso = await Descripcion.findOne({
            where: {
                CodigoDescripcion: code
            }
        });
        console.log("Descripcion: " + descripcionUso.Descripcion);
        return descripcionUso.Descripcion;
    }

    /*Obtiene el listado de los estados del vehiculo*/
    async getList() {
        try {
            var Descripciones = await Descripcion.findAll({
                order: Sequelize.literal('CodigoDescripcion')
            });
            console.log(Descripciones);
            return Descripciones;
        } catch (error) {
            console.log(error);
        }
    }

};

module.exports = new descripcion_uso_vehiculo_controller();