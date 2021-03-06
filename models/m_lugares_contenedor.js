const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Address = require('./m_direccion');
const Frequent_Place = require('./m_lugares_frecuentes');
const Direccion = require('./m_direccion');

const Places_container = db.define('TRA_LugaresContenedor', {
    IDLugarContenedor: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        validate: {
            notEmpty: true,
        }
    },
    FechaDeVisita: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        validate: {
            notEmpty: true,
        }
    },
    CreadoPor: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    ActualizadoPor: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
}, {
    underscored: false,
    timestamps: true,
    createdAt: 'FechaCreacion',
    updatedAt: 'FechaActualizacion',
    freezeTableName: true,
});

Address.belongsTo(Places_container, {
    foreignKey: 'IDLugarContenedor',
    onDelete: 'cascade'
});

Places_container.belongsTo(Frequent_Place, {
    foreignKey: 'IDLugarFrecuente'
});

Direccion.belongsTo(Places_container, {
    foreignKey: 'IDLugarContenedor',
    onDelete: 'cascade'
});

module.exports = Places_container;