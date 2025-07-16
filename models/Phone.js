'use strict';
module.exports = (sequelize, DataTypes) => {
    const Phone = sequelize.define('Phone', {
        number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'phones',
        timestamps: true,
    });

    Phone.associate = function(models) {
        Phone.belongsTo(models.Contact, { foreignKey: 'contactId', onDelete: 'CASCADE' });
        models.Contact.hasMany(Phone, { foreignKey: 'contactId' });
    };

    return Phone;
};
