const Unit = require('../models/m_unidad');

class unit_controller {
    constructor() {

    }

    /*Obtiene el listado de las unidades*/
    async getList() {
        try {
            var units = await Unit.findAll({
                attributes: ["id", 'name_unit']
            });
            console.log(units);
            return units;
        } catch (error) {
            console.log(error);
        }
    }

    /*Obtiene el selector de unidades 11012020_DD*/
    async getSelector(req, res) {
        //Cuando se necesite el selector
        try {
            var units = await this.getList();
            res.render('../views/user/unit_selector.html', {
                units,
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new unit_controller();