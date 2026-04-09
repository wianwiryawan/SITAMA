import { db } from './index';
import { users, tasks, taskAssignments } from './schema';
import bcrypt from 'bcrypt';

async function main() {

  try {

    console.log('Membersihkan data lama kalau ada');
    await db.delete(taskAssignments);
    await db.delete(tasks);
    await db.delete(users);

    const hashedPassword = await bcrypt.hash('siak', 10);

    console.log('Memasukkan data');
    const insertedUsers = await db.insert(users).values([
      { 
        username: 'Rizka', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Aulia', 
        password: hashedPassword, 
        role: 'ketua' 
      },
      { 
        username: 'Rahmi', 
        password: hashedPassword, 
        role: 'pimpinan' 
      },
    ]).returning();

    const staff1Id = insertedUsers[1].id;
    const staff2Id = insertedUsers[2].id;
    const staff3Id = insertedUsers[0].id;
    
    const insertedTasks = await db.insert(tasks).values([
      { 
        title: 'Optimalisasi Validasi Data SIAK', 
        status: 'doing', 
        priority: 'high' 
      },
      { 
        title: 'Monitoring Database Bulanan', 
        status: 'todo', 
        priority: 'medium' 
      },
      { 
        title: 'Sosialisasi Fitur Baru', 
        status: 'done', 
        priority: 'low' 
      },
    ]).returning();

    const task1Id = insertedTasks[0].id;
    const task2Id = insertedTasks[1].id;
    const task3Id = insertedTasks[2].id;

    await db.insert(taskAssignments).values([
      { userId: staff3Id, taskId: task3Id },
      { userId: staff1Id, taskId: task1Id },
      { userId: staff2Id, taskId: task2Id },
    ]);

  } catch (error) {
    console.error('Seeding gagal:', error);
  } finally {
    process.exit(0);
  }
}

main();