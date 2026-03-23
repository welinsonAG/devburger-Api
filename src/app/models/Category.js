import  { Model, DataTypes } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        path: DataTypes.TEXT,
        url: {
          type: DataTypes.VIRTUAL,
          get() {
           if (this.path) {
              
            return this.path || null;
           }
          },
        },
      },
      {
        sequelize,
        tableName: 'categories',
      },
    );
    return this;
  }
}

export default Category;
