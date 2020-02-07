const User_Role = require('../models/m_usuario_por_perfil');
const Role_Controller = require('./c_role');

class user_role_controller {
    constructor() {

    }

    /*
    Crea o actuliza los roles asociados al usuario
    05012019_DD
     */
    async createOrUpdate(user, selected_role_names) {
        try {
            var db_roles = await this.getList(user); //Objecto completo
            var selected_roles_codes = await this.getRoleCodeList(selected_role_names); //Array de los codigos unicamente
            //Caso de actualizacion de roles asociados
            if (db_roles) {
                console.log("Lista de roles recibida: " + db_roles);
                for (var r in db_roles) {
                    var codigo = db_roles[r].codigo_rol;
                    if (!selected_roles_codes.includes(codigo)) {
                        console.log("antes de destruir: " + codigo);
                        await this.destroy(user.id, codigo);
                    }
                }
            }
            //Creación de roles asociados al usuario
            var role_names = selected_role_names.split(',');
            for (var i in role_names) {
                await this.findOrCreate(user, role_names[i])
            }
        } catch (error) {
            console.log("Error: " + error);
        }

    }

    /*
    Obtiene el array de codigo de los roles enviados como parametro
    05012019_DD 
    */
    async getRoleCodeList(role_names) {
        var selected_roles_codes = [];
        var selected_roles_names = [];
        selected_roles_names = role_names.split(',');
        console.log(selected_roles_names);
        for (var r in selected_roles_names) {
            try {
                var code = await Role_Controller.getCodeByName(selected_roles_names[r]);
                selected_roles_codes.push(code);
            } catch (error) {
                console.log("Incapaz de obtener el codigo del rol " + error)
            }
        }
        return selected_roles_codes;
    }


    /*
    Encuntra o crea un rol asociado aun usuario
    05012019_DD
     */
    async findOrCreate(user, role) {
        try {
            if (user.id && role) {
                var role_code = await Role_Controller.getCodeByName(role);
                var user_role = await User_Role.findOrCreate({
                    where: {
                        user_id: user.id,
                        codigo_rol: role_code
                    },
                    defaults: {
                        user_id: user.id,
                        codigo_rol: role_code
                    }
                });
                var registry = JSON.stringify(user_role)
                console.log(registry);
                return registry;
            } else {
                throw "User ID o Role no definido";
            }
        } catch (error) {
            console.log(error)
        }
    }

    /*Obtiene el listado de los roles asociados al usarios
    05012019_DD
    */
    async getList(user) {
        try {
            var linked_roles = [];
            var roles = await User_Role.findAll({
                where: {
                    CodigoUsuario: user.CodigoUsuario
                }
            });
            roles.forEach(role => {
                linked_roles.push(role);
            })
            console.log("Lista de roles enviada: " + linked_roles);
            return linked_roles;
        } catch (error) {
            console.log(error);
        }
    }

    /*Eliminar un rol asociado al usuario
        05012019_DD
    */
    async destroy(user_id, codigo_role) {
        try {
            await User_Role.destroy({
                where: {
                    user_id: user_id,
                    codigo_rol: codigo_role
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

};

module.exports = new user_role_controller();