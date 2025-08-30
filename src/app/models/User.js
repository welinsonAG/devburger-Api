import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin:{
type: Sequelize.BOOLEAN,
allowNull: false,
defaultValue: false,
        } 
      },
      {
        sequelize,
        tableName: 'users',
         timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10);
      }
    });
    return this;
  }

    async checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
