'use strict';
module.exports = (sequelize, DataTypes) => {
  const organisationRequitments = sequelize.define('organisationRequitments', {
    organisationRequitmentId: {
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
    itemTitle: DataTypes.STRING,
    itemDescription: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  organisationRequitments.associate = function(models) {
    // associations can be defined here
    organisationRequitments.belongsTo(models.users, {
      foreignKey : 'userId',
      targetKey: 'userId',
      as: 'orgRequitments'
    });
    // organisationRequitments.belongsTo(models.UserOrganisations);
  };
  return organisationRequitments;
};