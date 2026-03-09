import { underscoredIf } from "sequelize/lib/utils";

// database.js
export default {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'devburger',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};


