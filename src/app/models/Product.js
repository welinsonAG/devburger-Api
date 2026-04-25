import Sequelize, { DataTypes, Model } from 'sequelize';


class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        
        price: {
          type:Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },

        images: {
          type: DataTypes.JSONB,
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

  this.belongsToMany(models.Order, {
    through: 'order_products',
    foreignKey: 'product_id',
    as: 'orders',
  });
   }

 get imagesUrl() {
    if (!this.images) return [];

    return this.images.map(
      (image) => ({
        thumb: image.thumb,
        medium: image.medium,
        large: image.large,
      })
    );
  }
      
  }

export default Product;
