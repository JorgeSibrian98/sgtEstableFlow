const Sequelize = require('sequelize');
/* const Employee = require('../models/m_employee'); */
const Unit = require('../models/m_unidad');
const db = require('../dbconfig/conex');

//Manejo de fechas
var moment = require('moment');
moment.locale("Es-SV")

const {
    body,
    check,
    validationResult
} = require('express-validator');

class employee_controller {
    constructor() {

    }

    /*Obtiene el selector de jefes de unidad*/
    async getSelector(req, res) {
        //Cuando se necesite el selector
        try {
            var unit_bosses = await this.getUnitBosses();
            res.render('../views/user/boss_selector.html', {
                unit_bosses,
            });
        } catch (error) {
            console.log(error);
        }
    }

    /*Obtiene el listado de los jefes de unidad 11012020_DD */
    async getUnitBosses() {
        try {
            var unit_bosses = await Employee.findAll({
                attributes: ['id', 'first_name', 'last_name', 'user_name'],
                include: [{
                    model: Unit,
                    raw: true,
                    required: false
                }],
                where: {
                    is_unit_boss: true
                }
            })
            console.log(unit_bosses);
            return unit_bosses;
        } catch (error) {
            console.log(error);
        }
    }

    //Metodo find por id
    /*Se buscarán datos como ubicación del empleado, unidad,puesto y se retornanrán en la variable "empInfo" además de incluir los \
    datos del token: nombres y apellidos del usuario*/
    async findById(user, req, res) {
        try {
            let empInfo;
            /* Consulta a la tabla de SIS_USUARIO */
            await db.query('SELECT dbo.GLO_UnidadesOrganizacionalesLey.NombreUnidadOrganizacionalLey as "Unidad",dbo.GLO_Ubicacion_O_Pad_Ley.Ubicacion_O_Pad as "Ubicacion", dbo.GLO_Relaciones_UnidadesOrganizacionalesLey.id_Relacion as "IDRelacionUnidadUbicacion", dbo.HUM_Puestos.NombrePuesto as "Puesto" FROM dbo.GLO_PersonasNaturales INNER JOIN dbo.HUM_Empleados ON dbo.GLO_PersonasNaturales.CodigoPersona = dbo.HUM_Empleados.CodigoEmpleado INNER JOIN dbo.GLO_UnidadesOrganizacionalesLey INNER JOIN dbo.GLO_Relaciones_UnidadesOrganizacionalesLey ON dbo.GLO_UnidadesOrganizacionalesLey.IdUnidadOrganizacional = dbo.GLO_Relaciones_UnidadesOrganizacionalesLey.IdUnidadOrganizacional INNER JOIN dbo.GLO_Ubicacion_O_Pad_Ley ON dbo.GLO_Relaciones_UnidadesOrganizacionalesLey.id_Ubicacion_O_Pad = dbo.GLO_Ubicacion_O_Pad_Ley.id_Ubicacion_O_Pad ON dbo.HUM_Empleados.CodigoRelacionUnidadOrganizacional = dbo.GLO_Relaciones_UnidadesOrganizacionalesLey.id_Relacion INNER JOIN dbo.HUM_Puestos ON dbo.HUM_Empleados.CodigoPuestoFuncionalEmpleado = dbo.HUM_Puestos.CodigoPuesto LEFT OUTER JOIN dbo.SIS_Usuarios ON dbo.HUM_Empleados.CodigoUsuario = dbo.SIS_Usuarios.CodigoUsuario WHERE dbo.SIS_Usuarios.CodigoUsuario = ? ', {
                replacements: [user.CodigoUsuario],
                type: db.QueryTypes.SELECT
            }).then(data => {
                empInfo = data[0];
                console.dir(empInfo)
            });
            //Nombre y apellidos obtenidos del token
            empInfo.NombresUsuario = user.NombresUsuario;
            empInfo.ApellidosUsuario = user.ApellidosUsuario;
            res.send({
                empInfo
            });
        } catch (err) {
            console.log(err);
        }
    }

    //Retorna los atributos del empleado encapsulado en el objeto emp
    async findById1(id) {
        try {
            var emp = new Object();
            emp.unit = new Object();
            await Employee.findByPk(id, {
                attributes: ['id', 'first_name', 'last_name', 'is_unit_boss', 'unit_id']
            }).then(employee => {
                //    console.log("El empleado recibido" + employee + " De tipo " + typeof (employee));
                emp.id = employee.id;
                emp.first_name = employee.first_name;
                emp.last_name = employee.last_name;
                emp.is_unit_boss = employee.is_unit_boss;
                emp.unit.id = employee.unit_id;
            });

            await Unit.findByPk(emp.unit.id, {
                attributes: ['name_unit']
            }).then(unit => {
                // console.log("DE LA UNIDAD" + unit + " De tipo " + typeof (unit));
                emp.unit.name = unit.name_unit
            });

            //console.dir("Empleado FINAL RESULT : " + JSON.stringify(emp));
            return emp;
        } catch (err) {
            console.log(err);
        }
    }
    //Retorna los atributos de la unidad através del id del usuario
    async findUnitByUser(user) {
        try {
            var unit = new Object();
            /* Consulta a la tabla de SIS_USUARIO */
            await db.query('SELECT dbo.GLO_UnidadesOrganizacionalesLey.NombreUnidadOrganizacionalLey as "Unidad",dbo.GLO_Ubicacion_O_Pad_Ley.Ubicacion_O_Pad as "Ubicacion", dbo.GLO_Relaciones_UnidadesOrganizacionalesLey.id_Relacion as "IDRelacionUnidadUbicacion", dbo.HUM_Puestos.NombrePuesto as "Puesto" FROM dbo.GLO_PersonasNaturales INNER JOIN dbo.HUM_Empleados ON dbo.GLO_PersonasNaturales.CodigoPersona = dbo.HUM_Empleados.CodigoEmpleado INNER JOIN dbo.GLO_UnidadesOrganizacionalesLey INNER JOIN dbo.GLO_Relaciones_UnidadesOrganizacionalesLey ON dbo.GLO_UnidadesOrganizacionalesLey.IdUnidadOrganizacional = dbo.GLO_Relaciones_UnidadesOrganizacionalesLey.IdUnidadOrganizacional INNER JOIN dbo.GLO_Ubicacion_O_Pad_Ley ON dbo.GLO_Relaciones_UnidadesOrganizacionalesLey.id_Ubicacion_O_Pad = dbo.GLO_Ubicacion_O_Pad_Ley.id_Ubicacion_O_Pad ON dbo.HUM_Empleados.CodigoRelacionUnidadOrganizacional = dbo.GLO_Relaciones_UnidadesOrganizacionalesLey.id_Relacion INNER JOIN dbo.HUM_Puestos ON dbo.HUM_Empleados.CodigoPuestoFuncionalEmpleado = dbo.HUM_Puestos.CodigoPuesto LEFT OUTER JOIN dbo.SIS_Usuarios ON dbo.HUM_Empleados.CodigoUsuario = dbo.SIS_Usuarios.CodigoUsuario WHERE dbo.SIS_Usuarios.CodigoUsuario = ? ', {
                replacements: [user.CodigoUsuario],
                type: db.QueryTypes.SELECT
            }).then(data => {
                unit = data[0].Unidad;
            });

            console.log("DE LA UNIDAD" + unit + " De tipo " + typeof (unit));

            return unit;
        } catch (err) {
            console.log(err);
        }
    }
};

module.exports = new employee_controller();