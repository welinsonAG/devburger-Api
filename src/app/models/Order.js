import { Model, DataTypes } from "sequelize";

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        user: DataTypes.JSONB,
        products: DataTypes.JSONB,
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