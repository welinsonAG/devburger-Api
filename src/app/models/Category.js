import { Model, DataTypes } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        path: DataTypes.TEXT,
        url: {
          type: DataTypes.VIRTUAL,
          get() {
            

            return this.path || null;
          }
        }
      },
      {
        sequelize,
        tableName: 'categories',
        underscored: true,
        timestamps: false // 👈 importante se não tiver no banco
      }
    );

    return this;
  }
}

export default Category;