import  { Model, DataTypes } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        path: DataTypes.TEXT,
        url: {
          type: DataTypes.VIRTUAL,
        get images_url() {
    if (!this.images) return [];

    return this.images.map(
      (image) =>
        `https://gishberyzmwbclyxgqrp.supabase.co/storage/v1/object/public/products/${image}`
    );
  }
}
      },
      {
        sequelize,
        tableName: 'categories',
      }
    );

    return this;
  }
}


export default Category;
