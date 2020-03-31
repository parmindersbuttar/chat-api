'use strict';
module.exports = (sequelize, DataTypes) => {
  const DonatedItem = sequelize.define('DonatedItems', {
    donatedIemid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    organisationId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
          model: 'users',
          key: 'userId'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
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
    itemId: {
      allowNull: false,
      type: DataTypes.STRING,
      references: {
          model: 'Donations',
          key: 'itemId'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    message: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  DonatedItem.associate = function(models) {
    // associations can be defined here
    // DonatedItem.belongsTo(models.organisations, {
    //   foreignKey : 'organisationId',
    //   targetKey: 'organisationId',
    //   as: 'organisationdetail'
    // });
    DonatedItem.belongsTo(models.users, {
      foreignKey : 'userId',
      targetKey: 'userId',
      as: 'ItemsDonated'
    });
    DonatedItem.belongsTo(models.Donations, {
      foreignKey : 'itemId',
      targetKey: 'itemId',
      as: 'donationDetail'
    });
  };
  return DonatedItem;
};