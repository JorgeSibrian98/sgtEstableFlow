const Sequelize = require('sequelize');
/* const Employee = require('../models/m_employee'); */
const Unit = require('../models/m_unidad');

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
    async findById(user, req, res) {
        try {
            /* let emp = await Employee.findByPk(id, {
                attributes: ['id', 'first_name', 'last_name', 'is_unit_boss', 'unit_id']
            }); */
            console.log("El empleado recibido" + user);
            let unit = await Unit.findByPk(user.unit_id, {
                attributes: ['name_unit']
            });
            console.log("De la unidad" + unit);

            res.send({
                user,
                unit
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
            unit.id = user.unit_id;
            await Unit.findByPk(user.unit_id, {
                attributes: ['name_unit']
            }).then(u => {
                // console.log("DE LA UNIDAD" + unit + " De tipo " + typeof (unit));
                unit.name = u.name_unit
            });

            console.log("DE LA UNIDAD" + unit + " De tipo " + typeof (unit));
            return unit;
        } catch (err) {
            console.log(err);
        }
    }



};

module.exports = new employee_controller();