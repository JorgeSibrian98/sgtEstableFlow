const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const route_conditions = db.define('TRA_Condiciones_Ruta', {
    IDCondicionesRuta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            notEmpty: true,
        }
    },
    Lunes: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notEmpty: true
        },
    },
    CantidadMotoristasLunes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notEmpty: true
        },
    },
    Martes: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notEmpty: true
        },
    },
    CantidadMotoristasMartes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notEmpty: true
        },
    },
    Miercoles: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notEmpty: true
        },
    },
    CantidadMotoristasMiercoles: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notEmpty: true
        },
    },
    Jueves: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notEmpty: true
        },
    },
    CantidadMotoristasJueves: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notEmpty: true
        },
    },
    Viernes: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notEmpty: true
        },
    },
    CantidadMotoristasViernes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notEmpty: true
        },
    },
    Sabado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notEmpty: true
        },
    },
    CantidadMotoristasSabado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notEmpty: true
        },
    },
    Domingo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notEmpty: true
        },
    },
    CantidadMotoristasDomingo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notEmpty: true
        },
    },
    CreadoPor: {
        type: Sequelize.CHAR(10),
        allowNull: true
    },
    ActualizadoPor: {
        type: Sequelize.CHAR(10),
        allowNull: true
    },
}, {
    underscored: false,
    timestamps: true,
    createdAt: 'FechaCreacion',
    updatedAt: 'FechaActualizacion',
    freezeTableName: true,
});

module.exports = route_conditions;