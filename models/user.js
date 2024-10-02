'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
        password: DataTypes.STRING,
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [
            { unique: true, fields: ['email'] },
            { unique: true, fields: ['phone'] }
        ]
    });

    User.associate = function (models) {
        // User.hasMany(models.Case)
    };

    return User;
}