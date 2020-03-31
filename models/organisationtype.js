'use strict';
module.exports = (sequelize, DataTypes) => {
  const organisationType = sequelize.define('organisationTypes', {
    organisationTypeId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    organisationTypeName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    organisationTypeDescription: {
      allowNull: false,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    freezeTableName: true
  });
  organisationType.associate = function(models) {
    // associations can be defined here
    organisationType.hasMany(models.UserOrganisations, {
    foreignKey : 'organisationTypeId',
    targetKey: 'organisationTypeId',
    as: 'organisationType'
    });
  };
  return organisationType;
};