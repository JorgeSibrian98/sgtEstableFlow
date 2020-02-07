const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const UserRol = require('./m_usuario_por_perfil');
const ReportePerfil = require('./m_reporte_por_perfil');

const Role = db.define('SIS_Perfiles', {
    CodigoPerfil: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    NombrePerfil: {
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
    /* createdAt: 'created_at',
     updatedAt: 'updated_at', */
    freezeTableName: true,
});

Role.hasMany(UserRol, {
    foreignKey: 'CodigoPerfil',
    onDelete: 'cascade'
});

Role.hasMany(ReportePerfil, {
    foreignKey: 'CodigoPerfil',
});

module.exports = Role;