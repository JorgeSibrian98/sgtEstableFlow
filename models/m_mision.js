const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const Mision = db.define('TRA_Mision', {
    Nombre_mision: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    Mision_activa: {
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