import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        
        price: {
          type:Sequelize.INTEGER,
          allowNull: false,
        },

        images: {
          type: Sequelize.JSONB,
          allowNull: false,
          validate: {
            notEmpty: true,
          }
        },

        offer: Sequelize.BOOLEAN,
        
        },
      
      {
        sequelize,
        tableName: 'products',
      },
    );
    return this;
  }
  static associate(models){
    this.belongsTo(models.Category,{
      foreignKey: 'category_id',
      as: 'category',
  })
   }

 get images_url() {
    if (!this.images) return [];

    return this.images.map(
      (image) =>
        `https://gishberyzmwbclyxgqrp.supabase.co/storage/v1/object/public/products/${image}`
    );
  }
}
export default Product;
