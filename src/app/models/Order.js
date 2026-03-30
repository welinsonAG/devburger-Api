import { Model, DataTypes } from "sequelize";


class Order extends Model {

  static init(sequelize) {
    super.init(
      {
        user_id: DataTypes.STRING,
        user_name: DataTypes.STRING,

      

        status: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "orders",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Product, {
      through: 'order_products',
      foreignKey: 'order_id',
      as: 'products',
    });
  }
}

export default Order;