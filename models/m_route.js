const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const frequent_places = require('./m_lugares_frecuentes');
const route_conditions = require('./m_route_conditions');

const Route = db.define('TRA_Ruta', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    validate: {
      notEmpty: true,
    }
  },
  created_by: {
    type: Sequelize.INTEGER
  },
  updated_by: {
    type: Sequelize.INTEGER
  },
}, {
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  freezeTableName: true,
});

Route.hasOne(route_conditions, {
  foreignKey: 'route_id',
  onDelete: 'cascade'
});

Route.hasMany(frequent_places, {
  foreignKey: 'IDRuta'
});

module.exports = Route;