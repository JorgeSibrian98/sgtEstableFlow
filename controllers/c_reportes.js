const Sequelize = require('sequelize');
const Reporte = require('../models/m_reporte');

class reportes_controller {
    constructor() {

    }

    /*Obtiene el listado de los reportes*/
    async getList(req, res) {
        try {
            var reportes = await Reporte.findAll({
                order: Sequelize.literal('Id')
            });
            console.log(reportes);
            res.render('reportes/reporte.html', {
                reportes
            })
        } catch (error) {
            console.log(error);
        }
    }

};

module.exports = new reportes_controller();