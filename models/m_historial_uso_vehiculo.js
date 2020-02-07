const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Vehiculo = require('./m_vehiculo');
const User = require('./m_usuario');
const Descripcion = require('./m_descripcion_uso_vehiculo');

const HistorialUsoVehiculo = db.define('TRA_HistorialUsoVehiculo', {
    FechaHoraUso: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    NuevoKilometraje: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    DetalleUso: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
}, {
    underscored: false,
    timestamps: false,
    freezeTableName: true,
});

HistorialUsoVehiculo.belongsTo(Vehiculo, {
    foreignKey: 'CodigoActivoFijo_Vehiculo',
});

HistorialUsoVehiculo.belongsTo(User, {
    foreignKey: 'ResponsableRegistro',
});

HistorialUsoVehiculo.belongsTo(Descripcion, {
    foreignKey: 'CodigoDescripcionUso',
});

module.exports = HistorialUsoVehiculo;