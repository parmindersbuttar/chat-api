'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('userCausesAreas', {
      userCausesAreaId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserOrganisationId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: 'UserOrganisations',
            key: 'UserOrganisationId'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      causeAreaId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: 'causesAreas',
            key: 'causeAreaId'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('userCausesAreas');
  }
};