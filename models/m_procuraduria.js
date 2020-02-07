const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Routes = require('./m_route');
const Vehicles = require('./m_vehicle');
const Employee = require('./m_employee');
const Folo6 = require('./m_folo6');
const Address = require('./m_address');
const Frequent_Place = require('./m_frequent_place');
const Voucher_procu_assign = require('./m_voucher_procu_assign');
const Misiones = require('./m_mision');
const Users = require('./m_user');

const Procuraduria = db.define('SGT_Procuraduria', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        validate: {
            notEmpty: true,
        },
    },
    created_by: {
        type: Sequelize.INTEGER
    },
    updated_by: {
        type: Sequelize.INTEGER
    }
}, {
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
});

Procuraduria.hasMany(Routes, {
    foreignKey: 'procuraduria_id',
    onDelete: 'cascade'
});
Procuraduria.hasMany(Frequent_Place, {
    foreignKey: 'procuraduria_id',
    onDelete: 'cascade'
});
Procuraduria.hasMany(Vehicles, {
    foreignKey: 'procuraduria_id',
    onDelete: 'cascade'
});
Procuraduria.belongsTo(Address, {
    foreignKey: 'address_id'
});
Procuraduria.hasMany(Employee, {
    foreignKey: 'procuraduria_id',
    onDelete: 'cascade'
});
Procuraduria.hasMany(Folo6, {
    foreignKey: 'procuraduria_id',
    onDelete: 'cascade'
});
Procuraduria.hasMany(Misiones, {
    foreignKey: 'procuraduria_id',
    onDelete: 'cascade'
});
Procuraduria.hasMany(Voucher_procu_assign, {
    foreignKey: 'procuraduria_id',
    onDelete: 'cascade'
});
Procuraduria.hasMany(Users, {
    foreignKey: 'procuraduria_id',
    onDelete: 'cascade'
});

module.exports = Procuraduria;