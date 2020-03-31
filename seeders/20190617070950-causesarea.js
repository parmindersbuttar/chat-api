'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('causesAreas',[
        {
          causeAreaName:'animals',
          causeAreaImage: '',
          causeAreaDescription: 'lorem Ipsum'
        },
        {
          causeAreaName:'Art and Culture',
          causeAreaImage: '',
          causeAreaDescription: 'lorem Ipsum'
        },
        {
          causeAreaName:'childrun and youth',
          causeAreaImage: '',
          causeAreaDescription: 'lorem Ipsum'
        },
        {
          causeAreaName:'Community',
          causeAreaImage: '',
          causeAreaDescription: 'lorem Ipsum'
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
