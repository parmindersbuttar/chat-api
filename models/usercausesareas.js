'use strict';
module.exports = (sequelize, DataTypes) => {
  const userCausesAreas = sequelize.define('userCausesAreas', {
    userCausesAreaId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserOrganisationId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
          model: 'userCausesAreas',
          key: 'UserOrganisationId'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    causeAreaId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
          model: 'causesAreas',
          key: 'causeAreaId'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    }
  }, {
    freezeTableName: true
  });
  userCausesAreas.associate = function(models) {
    // associations can be defined here
    userCausesAreas.belongsTo(models.UserOrganisations, {
      foreignKey : 'UserOrganisationId',
      targetKey: 'UserOrganisationId',
      as: 'UserOrganisationDetails'
      });
      userCausesAreas.belongsTo(models.causesAreas, {
        foreignKey : 'causeAreaId',
        targetKey: 'causeAreaId',
        as: 'UserCausesDetails'
        });
  };
  return userCausesAreas;
};