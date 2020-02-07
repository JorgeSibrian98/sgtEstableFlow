const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const ReportePerfil = require('./m_reporte_por_perfil');

const Reporte = db.define('TRA_Reportes', {
    NombreReporte: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    DescripcionReporte: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    underscored: false,
    timestamps: false,
    freezeTableName: true,
});

Reporte.hasMany(ReportePerfil, {
    foreignKey: 'ReporteId'
});


module.exports = Reporte;