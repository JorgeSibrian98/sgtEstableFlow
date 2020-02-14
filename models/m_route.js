const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const frequent_places = require('./m_lugares_frecuentes');
const route_conditions = require('./m_route_conditions');

const Route = db.define('TRA_Ruta', {
  IDRuta: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    validate: {
      notEmpty: true,
    }
  },
  Nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  Habilitado: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    validate: {
      notEmpty: true,
    }
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

Route.hasOne(route_conditions, {
  foreignKey: 'IDRuta',
  onDelete: 'cascade'
});

Route.hasMany(frequent_places, {
  foreignKey: 'IDRuta'
});

module.exports = Route;