'use strict';
module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define('Contact', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'contacts',
        timestamps: true,
    });

    Contact.associate = function(models) {
        Contact.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    };

    return Contact;
};
