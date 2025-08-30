import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import configDatabase from '../config/database';
import User from '../app/models/User';
import Product from '../app/models/Product';
import Category from '../app/models/Category';

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  async init() {
    try {
      this.connection = new Sequelize(configDatabase);
      await this.connection.authenticate();
      console.log('✅ Conexão com o banco estabelecida');

      models
        .map((model) => model.init(this.connection))
        .map(
          (model) => model.associate && model.associate(this.connection.models),
        );
    } catch (error) {
      console.error('❌ Erro ao conectar no banco:', error.message);
      process.exit(1);
    }
  }

  async mongo() {
    try {
      this.mongoConnection = await mongoose.connect('mongodb://localhost:27017/devburger');
      console.log('✅ Conexão com o MongoDB estabelecida');
    } catch (error) {
      console.error('❌ Erro ao conectar no MongoDB:', error.message);
      process.exit(1);
    }
  }
}

export default new Database();