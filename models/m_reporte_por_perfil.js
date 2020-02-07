const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');


const ReportePorPerfil = db.define('TRA_ReportePorPefil', {}, {
    underscored: false,
    timestamps: false,
    freezeTableName: true,
});


module.exports = ReportePorPerfil;