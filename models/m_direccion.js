const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const UbicacionesGeograficas = require('./m_ubicaciones_geograficas');

const Direccion = db.define('TRA_Direccion', {
    nombre: { //Campo agregado el 03/09/2019 por Axel.
        type: Sequelize.STRING(250),
        allowNull: true,
    },
    detalle: { //Última modificación el 03/09/2019 por Axel. Ahora permite nulos.
        type: Sequelize.STRING(250),
        allowNull: true,
    },
}, {
    underscored: true,
    timestamps: true,
    freezeTableName: true,
});

Direccion.belongsTo(UbicacionesGeograficas, {
    foreignKey: 'Cod_depto',
});

Direccion.belongsTo(UbicacionesGeograficas, {
    foreignKey: 'Cod_mun',
});

module.exports = Direccion;