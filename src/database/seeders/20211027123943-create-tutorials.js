'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Tutorials', [
      {
        title: "Reparacion de PC",
        image: "aside-01.jpg",
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        title: "Hackeo a full",
        image: "aside-02.jpg",
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        title: "Recuperación de datos",
        image: "aside-03.jpg",
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        title: "Recuperación de contraseñas",
        image: "aside-04.jpg",
        createdAt : new Date(),
        updatedAt : new Date(),
      }

    ], {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Tutorials', null, {});

  }
};
