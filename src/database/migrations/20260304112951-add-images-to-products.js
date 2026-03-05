export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'images', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.removeColumn('products', 'path');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'images');

    await queryInterface.addColumn('products', 'path', {
      type: Sequelize.STRING,
    });
  },
};