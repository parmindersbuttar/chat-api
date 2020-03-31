'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserOrganisations', {
      UserOrganisationId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'userId'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      organisationTypeId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'organisationTypes',
            key: 'organisationTypeId'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      // causeAreaId: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //       model: 'causesAreas',
      //       key: 'causeAreaId'
      //   },
      //   onUpdate: 'cascade',
      //   onDelete: 'cascade'
      // },
      organisationName: {
        allowNull: false,
        type:Sequelize.STRING
      },
      einNumber: {
        allowNull: true,
        type: Sequelize.STRING
      },
      website: {
        allowNull: true,
        type: Sequelize.STRING
      },
      logo: {
        allowNull: true,
        type: Sequelize.STRING
      },
      missionStatement: {
        allowNull: true,
        type: Sequelize.STRING
      },
      organisationDescription: {
        allowNull: true,
        type: Sequelize.STRING
      },
      // successStory: {
      //   allowNull: true,
      //   type: Sequelize.STRING
      // },
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
    return queryInterface.dropTable('UserOrganisations');
  }
};