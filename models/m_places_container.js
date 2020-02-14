const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Address = require('./m_direccion');
const Frequent_Place = require('./m_lugares_frecuentes');
const Folo_06 = require('./m_folo6');

const Places_container = db.define('TRA_LugaresContenedor', {
    date_of_visit: {
        type: Sequelize.DATEONLY,
        allowNull: true,
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
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
});

Address.belongsTo(Places_container, {
    foreignKey: 'container_id',
    onDelete: 'cascade'
});

Places_container.belongsTo(Frequent_Place, {
    foreignKey: 'frequent_place_id'
});

module.exports = Places_container;