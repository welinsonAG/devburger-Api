import { Model, DataTypes } from "sequelize";

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: DataTypes.STRING,
        user_name: DataTypes.STRING,

        products: DataTypes.JSON,

        status: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "orders",
      }
    );

    return this;
  }
}

export default Order;