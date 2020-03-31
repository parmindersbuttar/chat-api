'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('organisationTypes',[
        {
          organisationTypeName:'501@nonprofit',
          organisationTypeDescription: 'lorem Ipsum'
        },
        {
          organisationTypeName:'schools',
          organisationTypeDescription: 'lorem Ipsum'
        },
        {
          organisationTypeName:'NON US NGO',
          organisationTypeDescription: 'lorem Ipsum'
        },
        {
          organisationTypeName:'other Organisations',
          organisationTypeDescription: 'lorem Ipsum'
        }
    ],{})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
