import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class TaskAssignment extends Model {}

TaskAssignment.init({
  userId: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  taskId: {
    type: DataTypes.INTEGER,
    references: { model: 'tasks', key: 'id' }
  }
}, { 
  sequelize, 
  tableName: 'task_assignments',
  underscored: true 
});

export default TaskAssignment;