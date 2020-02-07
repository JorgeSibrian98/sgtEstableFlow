const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Estado = require('./m_estado_vehiculo');
const TipoVehiculo = require('./m_tipo_vehiculo');
const OficinaResponsable = require('./m_oficina_responsable_vehiculo');

const Vehiculo = db.define('TRA_Vehiculos', {
    CodigoActivoFijo: {
        type: Sequelize.CHAR(21),
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    NumeroPlacaVehiculo: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    NumeroChasisVehiculo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    NumeroMotorVehiculo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    NumeroVINVehiculo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    MarcaVehiculo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    ModeloVehiculo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    ColorVehiculo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    AnnoVehiculo: {
        type: Sequelize.CHAR(4),
        allowNull: false,
        validate: {
            isNumeric: true,
        }
    },
    CapacidadPersonaVehiculo: {
        type: Sequelize.TINYINT,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    TipoCombustibleVehiculo: {
        type: Sequelize.STRING(1),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    ObservacionesVehiculo: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    KilometrajeActual: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
}, {
    underscored: false,
    timestamps: false,
    freezeTableName: true,
    hasTrigger:true
});

Vehiculo.belongsTo(Estado, {
    foreignKey: 'CodigoEstado',
});
Vehiculo.belongsTo(TipoVehiculo, {
    foreignKey: 'CodigoTipoVehiculo',
});
Vehiculo.belongsTo(OficinaResponsable, {
    foreignKey: 'CodigoOficinaResponsableVehiculo',
});

module.exports = Vehiculo;