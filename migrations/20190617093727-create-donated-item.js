'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DonatedItems', {
      donatedIemid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organisationId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'userId'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
      itemId: {
        type: Sequelize.STRING,
        references: {
            model: 'Donations',
            key: 'itemId'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      message: {
        allowNull: true,
        type: Sequelize.STRING
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
    return queryInterface.dropTable('DonatedItems');
  }
};