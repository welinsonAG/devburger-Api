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
            if (!this.path) return null;

            return `https://gishberyzmwbclyxgqrp.supabase.co/storage/v1/object/public/products/${this.path}`;
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