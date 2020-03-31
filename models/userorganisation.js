'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserOrganisation = sequelize.define('UserOrganisations', {
    UserOrganisationId: {
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
    organisationTypeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
          model: 'organisationTypes',
          key: 'organisationTypeId'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    organisationName: DataTypes.STRING,
    einNumber: DataTypes.STRING,
    website: DataTypes.STRING,
    logo: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    missionStatement: DataTypes.STRING,
    organisationDescription: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  UserOrganisation.associate = function(models) {
    UserOrganisation.belongsTo(models.users, {
      foreignKey : 'userId',
      targetKey: 'userId',
      as: 'UserOrg'
    })
    UserOrganisation.belongsTo(models.organisationTypes, {
      foreignKey : 'organisationTypeId',
      targetKey: 'organisationTypeId',
      as: 'OrgDetail'
    })
    // UserOrganisation.hasMany(models.organisationRequitments)
    UserOrganisation.hasMany(models.userCausesAreas, {
      foreignKey : 'UserOrganisationId',
      targetKey: 'UserOrganisationId',
      as: 'UserOrganisationDetails'
    })
    UserOrganisation.hasMany(models.organsationSuccessStories, {
      foreignKey : 'UserOrganisationId',
      targetKey: 'UserOrganisationId',
      as: 'SuccessStories'
    })
  }
  return UserOrganisation;
}