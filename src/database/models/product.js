'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Image,{
        as : 'images',
        onDelete : 'cascade',
        foreignKey : 'productId'
      })
      Product.belongsTo(models.Category,{
        as : 'category',
        foreignKey : 'categoryId'
      })
      Product.belongsToMany(models.Feature,{
        as : 'features',
        through : 'product_feature',
        foreignKey : 'productId',
        otherKey : 'featureId'
      })
    }
  };
  Product.init({
    name: {
      type : DataTypes.STRING,
      allowNull :false
    }, 
    description: {
     type : DataTypes.STRING(600),
    },
    price: DataTypes.DECIMAL,
    discount: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    show : DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};