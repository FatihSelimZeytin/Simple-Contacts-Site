'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'users',
        timestamps: true,
    });
    User.associate = function(models) {
        // Associations can be defined here later, for example:
        // User.hasMany(models.Contact, { foreignKey: 'userId' });
    };

    return User;
};
