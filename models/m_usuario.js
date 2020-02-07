const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Unit = require('./m_unidad');
/* const Employee = require('./m_employee'); */
const UserRol = require('./m_usuario_por_perfil');
/* const Folo6_Approve = require('./m_folo6_approve_state');
const Folo6 = require('./m_folo6'); */

const User = db.define('SIS_Usuarios', {
    CodigoUsuario: {
        primaryKey: true,
        type: Sequelize.CHAR(10),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    NombresUsuario: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    ApellidosUsuario: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    CodigoUsuarioSupervisor: {
        type: Sequelize.CHAR(10),
        defaultValue: '0',
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    CorreoElectronicoUsuario: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    ClaveUsuario: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    ActivoInactivoUsuario: {
        type: Sequelize.CHAR(1),
        allowNull: false,
        defaultValue: false
    },
}, {
    underscored: false,
    timestamps: false,
    /* createdAt: 'created_at',
    updatedAt: 'updated_at', */
    freezeTableName: true
});

/* User.hasMany(Folo6, {
    foreignKey: 'created_by'
});
User.hasMany(Folo6_Approve, {
    foreignKey: 'aprove_boss_id'
});
User.hasMany(Folo6_Approve, {
    foreignKey: 'aprove_tunit_boss_id'
}); */

User.hasMany(UserRol, {
    foreignKey: 'CodigoUsuario',
    onDelete: 'cascade'
});

/* User.belongsTo(Employee, {
    foreignKey: 'id_boss'
}); */

/* User.belongsTo(Unit, {
    foreignKey: 'unit_id'
}) */

module.exports = User;