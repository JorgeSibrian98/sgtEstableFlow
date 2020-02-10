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
    }
}, {
    underscored: false,
    timestamps: false,
    freezeTableName: true,
});
LugaresFrecuentes.belongsTo(UbicacionesGeograficas, {
    as: 'Departamento',
    foreignKey: 'CodDepto',
});

LugaresFrecuentes.belongsTo(UbicacionesGeograficas, {
    as: 'Municipio',
    foreignKey: 'CodMun',
});


module.exports = LugaresFrecuentes;