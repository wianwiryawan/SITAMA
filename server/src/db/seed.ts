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
        name: 'Rizka Auliarahmi, S.Tr.Kom',
        nip: '20001116 202504 2 004',
        pangkat: 'Penata Muda (III/a)',
        jabatan: 'Pranata Komputer Ahli Pertama', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Pak Ferdi',
        name: 'Ferdi Firmansyah S.Kom',
        nip: '19780704 201101 1 007',
        pangkat: 'Penata Tk.I (III/d)',
        jabatan: 'Pranata Komputer Ahli Muda', 
        password: hashedPassword, 
        role: 'katim' 
      },
      { 
        username: 'Pak Wahyu',
        name: 'Wahyu Widayat, M.T., CPSp',
        nip: '19750603 200801 1 001',
        pangkat: 'Pembina Tk.I (IV/b)',
        jabatan: 'Kepala Subdirektorat Sistem Informasi Administrasi Kependudukan', 
        password: hashedPassword, 
        role: 'kasubdit' 
      },
      { 
        username: 'Mba Utik',
        name: 'Utik Ananingsih, SE, MM',
        nip: '19830905 200801 2 001',
        pangkat: 'Penata (III/c)',
        jabatan: 'Penata Kelola Pemerintahan', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Mba Indra',
        name: 'Indra Lestari, A.Md ',
        nip: '19901025 202012 2 017',
        pangkat: 'Pengatur (II/c)',
        jabatan: 'Pengelola Layanan Pengadaan', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Mas Rangga',
        name: 'Rangga Prasetyo Ridwan, Y.W., S.Kom',
        nip: '19950613 202012 1 005',
        pangkat: 'Penata Muda (III/a)',
        jabatan: 'Pranata Komputer Ahli Pratama', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Mas Awang',
        name: 'Awang Brilian Brantas, S. Kom',
        nip: '19940930 202012 1 010',
        pangkat: 'Penata Muda (III/a)',
        jabatan: 'Pranata Komputer Ahli Pratama', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Puspa',
        name: 'Luh Nyoman Puspakha Majestie Sukma, S.Tr.I.P ',
        nip: '20020916 202409 2 001',
        pangkat: 'Penata Muda (III/a)',
        jabatan: 'Penata Kelola Pemerintahan', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Kak Dewi',
        name: 'Wahab Dewi Sinaga, S Kom',
        nip: '19940620 202521 2 020',
        pangkat: 'PPPK',
        jabatan: 'Penata Layanan Operasional', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Mas Usep',
        name: 'Usep Saepuloh, S Kom',
        nip: '19860314 202521 1 014',
        pangkat: 'PPPK',
        jabatan: 'Penata Layanan Operasional', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Mas Dafi',
        name: 'Rizka Khadafi, S.Kom.I',
        nip: '19901128 202521 1 012',
        pangkat: 'PPPK',
        jabatan: 'Penata Layanan Operasional', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Mas Ruli',
        name: 'Muhammad Nasruli, S. Sos',
        nip: '19870407 202521 1 019',
        pangkat: 'PPPK',
        jabatan: 'Penata Layanan Operasional', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Mas Rizal',
        name: 'Safrizal Fauzi',
        nip: '19841205 202521 1 018',
        pangkat: 'PPPK',
        jabatan: 'Operator Layanan Operasional', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Mas Nelson',
        name: 'Nelson Fernando, SE',
        nip: '19950705 202521 1 044',
        pangkat: 'PPPK',
        jabatan: 'Penata Layanan Operasional', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Dendi',
        name: 'Muhammad Dendi Pebriandi, S.Tr.IP',
        nip: '19990202 202208 1 001',
        pangkat: 'Penata Muda (III/a)',
        jabatan: 'Pengolah Data', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Kairan',
        name: 'Kairan Ketama Zakaria, S.Tr.I.P',
        nip: '20010817 202409 1 001',
        pangkat: 'Penata Muda (III/a)',
        jabatan: 'Penata Layanan Operasional', 
        password: hashedPassword, 
        role: 'staff' 
      },
      { 
        username: 'Mas Ridwan',
        name: 'Ridwan Rasiman',
        jabatan: 'Tenaga IT Support', 
        password: hashedPassword, 
        role: 'tenagaahli' 
      },
      { 
        username: 'Mas Tirto',
        name: 'Tirto Slamet Raharjo',
        jabatan: 'Tenaga IT Support', 
        password: hashedPassword, 
        role: 'tenagaahli' 
      },
      { 
        username: 'Mas Rahman',
        name: 'Rahman Hakim',
        jabatan: 'Tenaga IT Support', 
        password: hashedPassword, 
        role: 'tenagaahli' 
      },
      { 
        username: 'Mas Arief',
        name: 'Muhammad Arief Pambudi',
        jabatan: 'Tenaga IT Support', 
        password: hashedPassword, 
        role: 'tenagaahli' 
      },
      { 
        username: 'Mas Fajar',
        name: 'Fajar Wahyudi',
        jabatan: 'Tenaga IT Support', 
        password: hashedPassword, 
        role: 'tenagaahli' 
      },
      { 
        username: 'Mas Yudo',
        name: 'Achmad Yudo Tristanto',
        jabatan: 'Tenaga IT Support', 
        password: hashedPassword, 
        role: 'tenagaahli' 
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