const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
/* const Employees = require('./m_employee'); */

const Unit = db.define('SGT_Unidad', {
    name_unit: {
        type: Sequelize.STRING(75),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
}, {
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
});

/* Unit.hasMany(Employees, {
    foreignKey: 'unit_id'
}); */

module.exports = Unit;