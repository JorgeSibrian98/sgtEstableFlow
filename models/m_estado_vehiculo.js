const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const Estadovehiculo = db.define('TRA_EstadoVehiculo', {
    CodigoEstado: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    EstadoVehiculo: {
        type: Sequelize.CHAR(20),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    }
}, {
    underscored: false,
    timestamps: false,
    freezeTableName: true,
});

module.exports = Estadovehiculo;