const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const UbicacionesGeograficas = require('./m_ubicaciones_geograficas');

const LugaresFrecuentes = db.define('TRA_LugaresFrecuentes', {
    nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    Detalle: {
        type: Sequelize.STRING(150),
        allowNull: true
    },
    Id_procuraduria: {
        type: Sequelize.TINYINT,
        allowNull: true
    },
    Lugar_activo: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: '1'
    }
}, {
    underscored: false,
    timestamps: false,
    freezeTableName: true,
});
LugaresFrecuentes.belongsTo(UbicacionesGeograficas, {
    as: 'Departamento',
    foreignKey: 'Cod_depto',
});

LugaresFrecuentes.belongsTo(UbicacionesGeograficas, {
    as: 'Municipio',
    foreignKey: 'Cod_mun',
});


module.exports = LugaresFrecuentes;