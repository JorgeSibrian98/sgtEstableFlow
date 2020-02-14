const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const UbicacionesGeograficas = require('./m_ubicaciones_geograficas');
const LugaresContenedor = require('./m_lugares_contenedor');

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
    foreignKey: 'CodDepto',
});

Direccion.belongsTo(UbicacionesGeograficas, {
    foreignKey: 'CodMun',
});

Direccion.belongsTo(LugaresContenedor, {
    foreignKey: 'IDLugarContenedor',
    onDelete: 'CASCADE'
});

module.exports = Direccion;