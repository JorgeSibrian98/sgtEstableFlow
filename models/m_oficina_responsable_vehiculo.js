const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const OficinasResponsablesDeVehiculo = db.define('TRA_OficinasResponsablesDeVehiculos', {
    CodigoOficinaResponsableVehiculo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    DescripcionOficinaResponsableVehiculo: {
        type: Sequelize.STRING(100),
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

module.exports = OficinasResponsablesDeVehiculo;