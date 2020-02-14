const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const Mision = db.define('TRA_Mision', {
    IDMision: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        validate: {
            notEmpty: true,
        }
    },
    NombreMision: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    MisionActiva: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: '1'
    }
}, {
    underscored: false,
    timestamps: false,
    freezeTableName: true,
});

module.exports = Mision;