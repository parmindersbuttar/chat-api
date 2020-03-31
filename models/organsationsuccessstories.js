'use strict';
module.exports = (sequelize, DataTypes) => {
  const organsationSuccessStories = sequelize.define('organsationSuccessStories', {
    organsationSuccessStoriesId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserOrganisationId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
          model: 'UserOrganisations',
          key: 'UserOrganisationId'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    successStory: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  organsationSuccessStories.associate = function(models) {
    // associations can be defined here
    organsationSuccessStories.belongsTo(models.UserOrganisations, {
      foreignKey : 'UserOrganisationId',
      targetKey: 'UserOrganisationId',
      as: 'SuccessStories'
    })
  };
  return organsationSuccessStories;
};