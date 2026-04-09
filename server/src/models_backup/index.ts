import sequelize from '../config/database'; // Mengambil instance koneksi dari database.ts
import User  from './user';
import Task from './task';

// Relasi
// User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });

export {
  sequelize,
  User,     
  Task
};