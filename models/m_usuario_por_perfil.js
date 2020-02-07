const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const UserRol = db.define('SIS_UsuariosPorPerfil', {}, {
    underscored: false,
    timestamps: false,
    freezeTableName: true,
});

UserRol.removeAttribute('id');

module.exports = UserRol;