import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcrypt'
import Task from './task'

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public role!: 'Pimpinan' | 'Ketua Tim' | 'Staff';

  // Helper untuk mengecek password saat login
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public static associate() {
    User.belongsToMany(Task, { 
        through: 'task_assignments', 
        as: 'assigned_tasks', 
        foreignKey: 'user_id' 
    });
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 50]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Pimpinan', 'Ketua Tim', 'Staff'),
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  hooks: {
    // Fungsi ini jalan otomatis sebelum data dibuat (INSERT)
    beforeCreate: async (user: User) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10); // Membuat 'garam' acak
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    // Fungsi ini jalan otomatis sebelum data diupdate
    beforeUpdate: async (user: User) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

export default User;