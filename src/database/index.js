// src/database/index.js
import { Sequelize } from 'sequelize';
import Order from '../app/models/Order.js';
import databaseConfig from '../config/database.js';
import User from '../app/models/User.js';
import Product from '../app/models/Product.js';
import Category from '../app/models/Category.js';

const models = [User, Product, Category, Order];

class Database {
  constructor() {
    this.connection = null;
  }

  async init() {
  
    try {
      // Sequelize precisa dos parâmetros separados
      this.connection = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      });

      await this.connection.authenticate();
      console.log('✅ Conexão com o banco SQL estabelecida');

      models
        .map((model) => model.init(this.connection))
        .map(
          (model) => model.associate && model.associate(this.connection.models),
        );
    } catch (error) {
      console.error('❌ Erro ao conectar no banco SQL:', error);
      process.exit(1);
    }
  }
}

export default new Database();
