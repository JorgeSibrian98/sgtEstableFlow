const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const DescripcionUsoVehiculo = db.define('TRA_DescripcionUsoVehiculo', {
    CodigoDescripcion: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    Descripcion: {
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


module.exports = DescripcionUsoVehiculo;