'use strict';

module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: 'admin-user'
        },
        password: DataTypes.STRING,
        status: {
            type: DataTypes.STRING,
            defaultValue: 'active'
        }
    }, {
        indexes: [
            { unique: true, fields: ['email'] },
            { unique: true, fields: ['phone'] }
        ]
    });

    Admin.associate = function (models) {
        Admin.hasMany(models.Case, { as: 'cases' });
    }

    return Admin;
}