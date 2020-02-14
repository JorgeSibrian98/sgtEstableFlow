const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const UbicacionesGeograficas = require('./m_ubicaciones_geograficas');

const Direccion = db.define('TRA_Direccion', {
    IDDireccion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            notEmpty: true,
        }
    },
    Nombre: { //Campo agregado el 03/09/2019 por Axel.
        type: Sequelize.STRING(250),
        allowNull: true,
    },
    Detalle: { //Última modificación el 03/09/2019 por Axel. Ahora permite nulos.
        type: Sequelize.STRING(250),
        allowNull: true,
    },
    CreadoPor: {
        type: Sequelize.CHAR(10),
        allowNull: true
    },
    ActualizadoPor: {
        type: Sequelize.CHAR(10),
        allowNull: true
    }
}, {
    underscored: false,
    timestamps: true,
    freezeTableName: true,
    createdAt: 'FechaCreacion',
    updatedAt: 'FechaActualizacion'
});

Direccion.belongsTo(UbicacionesGeograficas, {
    foreignKey: 'Cod_depto',
});

Direccion.belongsTo(UbicacionesGeograficas, {
    foreignKey: 'Cod_mun',
});

module.exports = Direccion;