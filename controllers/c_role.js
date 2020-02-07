const Sequelize = require('sequelize');
const Role = require('../models/m_perfil');

class role_controller {
    constructor() {

    }

    /*
    Obtiene el codigo del rol solicitado
    05012019_DD
     */
    async getCodeByName(name) {
        console.log("Role name: " + name)
        var role = await Role.findOne({
            where: {
                name: name
            }
        });
        console.log("En getCodeByName: " + role.codigo_rol);
        return role.codigo_rol;
    }

    /*
    Obtiene el nombre del rol solicitado
    05012019_DD
     */
    async getNameByCode(code) {
        console.log("Role code: " + code)
        var role = await Role.findOne({
            where: {
                codigo_rol: code
            }
        });
        console.log("En getCodeByName: " + role);
        return role.name;
    }

    /*Obtiene el listado de los usarios y los renderiza en pantalla*/
    async getList() {
        try {
            var roles = await Role.findAll({
                order: Sequelize.literal('codigo_rol ASC')
            });
            console.log(roles);
            return roles;
        } catch (error) {
            console.log(error);
        }
    }

};

module.exports = new role_controller();