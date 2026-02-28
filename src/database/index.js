// src/database/index.js
import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database.js';
import User from '../app/models/User.js';
import Product from '../app/models/Product.js';
import Category from '../app/models/Category.js';

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  async init() {
    try {
      // Sequelize precisa dos parâmetros separados
      this.connection = new Sequelize(
        databaseConfig.database,
        databaseConfig.username,
        databaseConfig.password,
        {
          host: databaseConfig.host,
          dialect: databaseConfig.dialect,
          port: databaseConfig.port,
          define: databaseConfig.define,
          logging: false,
        }
      );

      await this.connection.authenticate();
      console.log('✅ Conexão com o banco SQL estabelecida');

     
      models
        .map((model) => model.init(this.connection))
        .map(
          (model) => model.associate && model.associate(this.connection.models)
        );
    } catch (error) {
      console.error('❌ Erro ao conectar no banco SQL:', error.message);
      process.exit(1);
    }
  }

  async mongo() {
    try {
      this.mongoConnection = await mongoose.connect(
        'mongodb://localhost:27017/devburger'
      );
      console.log('✅ Conexão com o MongoDB estabelecida');
    } catch (error) {
      console.error('❌ Erro ao conectar no MongoDB:', error.message);
      process.exit(1);
    }
  }
}


export default new Database();
