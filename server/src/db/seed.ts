import { db } from './index';
import { users, tasks, taskAssignments, events, eventParticipants } from './schema';
import bcrypt from 'bcrypt';

async function main() {

  try {
    console.log('Membersihkan data lama kalau ada');
    await db.delete(taskAssignments);
    await db.delete(eventParticipants);
    await db.delete(tasks);
    await db.delete(users);
    await db.delete(events);

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

    const insertedEvents = await db
      .insert(events)
      .values([
        {
          title: 'Rapat Tim',
          startDate: '2026-04-15',
          endDate: '2026-04-15',
          startTime: '09:00',
          endTime: '11:00',
          location: 'Ruang Rapat A',
          type: 'rapat',
        },
        {
          title: 'Workshop',
          startDate: '2026-04-16',
          endDate: '2026-04-18',
          startTime: '13:00',
          endTime: '16:00',
          location: 'Bandung',
          type: 'perdin',
        },
      ])
      .returning();

      const event1Id = insertedEvents[0].id;
      const event2Id = insertedEvents[1].id;

      await db.insert(eventParticipants).values([
      { userId: staff3Id, eventId: event1Id },
      { userId: staff1Id, eventId: event1Id },
      { userId: staff2Id, eventId: event2Id },
    ]);

  console.log('Seeding berhasil');
  } catch (error) {
    console.error('Seeding gagal:', error);
  } finally {
    process.exit(0);
  }
}

main();