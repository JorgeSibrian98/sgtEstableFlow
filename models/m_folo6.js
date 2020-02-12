const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Place_container = require('./m_places_container');
const Mision = require('./m_mision');

//const Voucher_folo6_assign = require('./m_voucher_folo6_assign');
//const Folo6_Approve = require('./m_folo6_approve_state');
//const Vehicle_folo6_assign = require('./m_vehicle_folo6_assign');

const Folo6 = db.define('SGT_Folo6', {
    IDMision: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        validate: {
            notEmpty: true,
        }
    },
    request_unit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    FechaSalida: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    HoraSalida: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    HoraRetorno: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    CantidadDePasajeros: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    ConMotorista: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    PersonaQueConducira: {
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    TipoDeLicencia: {
        type: Sequelize.STRING(30),
        allowNull: true,
    },
    Observacion: {
        type: Sequelize.STRING(150),
        allowNull: true,
    },
    CreadoPor: {
        type: Sequelize.CHAR(10),
        allowNull: true,
    }
}, {
    underscored: true,
    timestamps: true,
    createdAt: 'FechaCreacion',
    updatedAt: 'FechaActualizacion',
    freezeTableName: true,
});

Folo6.hasMany(Place_container, {
    foreignKey: 'folo_id',
    onDelete: 'CASCADE'
});

Folo6.hasMany(Mision, {
    foreignKey: 'IDMision',
    onDelete: 'CASCADE',
});

/* Folo6.hasMany(Voucher_folo6_assign, {
    foreignKey: 'folo6_id'
});

Folo6.hasOne(Folo6_Approve, {
    foreignKey: 'folo06_id',
});

Folo6.hasOne(Vehicle_folo6_assign, {
    foreignKey: 'folo06_id',
}); */

module.exports = Folo6;