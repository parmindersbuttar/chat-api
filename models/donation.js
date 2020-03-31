'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donations', {
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
          model: 'users',
          key: 'userId'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    itemName: DataTypes.STRING,
    itemDescription: DataTypes.STRING,
    itemImage: DataTypes.STRING,
    itemMethod: DataTypes.STRING,
    mile: DataTypes.INTEGER,
  }, {
    freezeTableName: true
  });
  Donation.associate = function(models) {
    // associations can be defined here
    Donation.belongsTo(models.users, {
      foreignKey: 'userId',
      targetKey: 'userId',
      as: 'user_donation'
    });
    Donation.hasMany(models.DonatedItems, {
      foreignKey: 'itemId',
      targetKey: 'itemId',
      as: 'donationDetail'
    });
  };
  return Donation;
};