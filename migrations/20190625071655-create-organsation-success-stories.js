'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('organsationSuccessStories', {
      organsationSuccessStoriesId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserOrganisationId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'UserOrganisations',
            key: 'UserOrganisationId'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      successStory: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('organsationSuccessStories');
  }
};