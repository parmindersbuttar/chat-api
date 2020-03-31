'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles',[
        {
          roleName:'admin',
          roleDescription: 'lorem Ipsum'
        },
        {
          roleName:'individual',
          roleDescription: 'lorem Ipsum'
        },
        {
          roleName:'organisation',
          roleDescription: 'lorem Ipsum'
        }
    ],{
      
    })
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
