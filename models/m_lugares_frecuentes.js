const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const UbicacionesGeograficas = require('./m_ubicaciones_geograficas');

const LugaresFrecuentes = db.define('TRA_LugaresFrecuentes', {
    IDLugarFrecuente: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        validate: {
            notEmpty: true,
        }
    },
    NombreLugarFrecuente: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    DetalleLugarFrecuente: {
        type: Sequelize.STRING(150),
        allowNull: true
    },
    IDProcuraduria: {
        type: Sequelize.TINYINT,
        allowNull: true
    },
    LugarFrecuenteActivo: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: '1'
    },
    CreadoPor: {
        type: Sequelize.CHAR(10),
        allowNull: true,
    },
    ActualizadoPor: {
        type: Sequelize.CHAR(10),
        allowNull: true,
    },
}, {
    underscored: false,
    timestamps: true,
    createdAt: 'FechaCreacion',
    updatedAt: 'FechaActualizacion',
    freezeTableName: true,
});
LugaresFrecuentes.belongsTo(UbicacionesGeograficas, {
    as: 'Departamento',
    foreignKey: 'CodDepartamento',
});

LugaresFrecuentes.belongsTo(UbicacionesGeograficas, {
    as: 'Municipio',
    foreignKey: 'CodMunicipio',
});


module.exports = LugaresFrecuentes;