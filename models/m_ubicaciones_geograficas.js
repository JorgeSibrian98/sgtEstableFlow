const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const UbicacionesGeograficas = db.define('GLO_UbicacionesGeograficas', {
    CodigoUbicacionGeografica: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        unique: true
    },
    NombreUbicacionGeografica: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    CodigoUbicacionGeograficaSuperior: {
        type: Sequelize.CHAR(10),
        allowNull: true,
        unique: true
    },
    NivelUbicacionGeografica: {
        type: Sequelize.TINYINT,
        allowNull: true
    }
}, {
    underscored: false,
    timestamps: false,
    freezeTableName: true,
});

module.exports = UbicacionesGeograficas;