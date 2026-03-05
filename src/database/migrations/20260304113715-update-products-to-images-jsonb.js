export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'images', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.removeColumn('products', 'path');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'images');

    await queryInterface.addColumn('products', 'path', {
      type: Sequelize.STRING,
    });
  },
};