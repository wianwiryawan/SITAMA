import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './user';

class Task extends Model {
  public id!: number;
  public title!: string;
  public status!: 'todo' | 'doing' | 'done';
  public priority!: 'low' | 'medium' | 'high';

  // Relasi Many-to-Many
  public static associate() {
    Task.belongsToMany(User, { 
      through: 'task_assignments', // Nama tabel penghubung
      as: 'assignees',             // bisa banyak user
      foreignKey: 'task_id' 
    });
  }
}

Task.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('todo', 'doing', 'done'), defaultValue: 'todo' },
  priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' }
}, { 
  sequelize, 
  tableName: 'tasks',
  underscored: true 
});

export default Task;