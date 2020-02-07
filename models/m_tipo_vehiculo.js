const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const TipoVehiculo = db.define('TRA_TipoVehiculo', {
    CodigoTipoVehiculo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    TipoVehiculo: {
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

module.exports = TipoVehiculo;