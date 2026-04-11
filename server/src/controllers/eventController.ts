import { Request, Response } from 'express';
import { db } from '../db';
import { events, eventParticipants } from '../db/schema';
import { and, eq, inArray, lte, gte } from 'drizzle-orm';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const data = await db.query.events.findMany({
      with: {
        participants: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (events, { asc }) => [asc(events.startDate), asc(events.startTime)],
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil agenda", error });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  const { title, startDate, endDate, startTime, endTime, location, type, participants } = req.body;
  //participant berupa arrya

  try {
    // Cek bentrok
    if (participants && participants.length > 0) {
      const overlapping = await db
        .select()
        .from(events)
        .innerJoin(eventParticipants, eq(events.id, eventParticipants.eventId))
        .where(
          and(
            eq(events.startDate, startDate), // Cek tanggal
            inArray(eventParticipants.userId, participants), // Cek peserta
            // (Mulai < Akhir_Existing) DAN (Selesai > Mulai_Existing)
            lte(events.startTime, endTime),
            gte(events.endTime, startTime)
          )
        );

      if (overlapping.length > 0) {
        return res.status(400).json({
          message: "Jadwal bentrok! peserta sudah memiliki agenda lain di jam tersebut.",
          details: overlapping.map(o => ({
            user: o.event_participants.userId,
            event: o.events.title
          }))
        });
      }
    }

    const newEvent = await db.insert(events).values({
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      type
    }).returning();

    const eventId = newEvent[0].id;

    if (participants && participants.length > 0) {
      const participantRecords = participants.map((uid: number) => ({
        eventId: eventId,
        userId: uid
      }));
      await db.insert(eventParticipants).values(participantRecords);
    }

    res.status(201).json({ message: "Agenda berhasil dibuat", data: newEvent[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menyimpan agenda", error });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { participants, ...eventData } = req.body;

  try {
    // Update data
    await db.update(events)
      .set(eventData)
      .where(eq(events.id, Number(id)));

    // Update peserta 
    if (participants) {
      await db.delete(eventParticipants).where(eq(eventParticipants.eventId, Number(id)));
      if (participants.length > 0) {
        const participantRecords = participants.map((uid: number) => ({
          eventId: Number(id),
          userId: uid
        }));
        await db.insert(eventParticipants).values(participantRecords);
      }
    }

    res.json({ message: "Agenda berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Gagal update agenda", error });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Karena onDelete: 'cascade' di skema
    // data di tabel eventParticipants akan otomatis ikut terhapus
    const deletedEvent = await db.delete(events)
      .where(eq(events.id, Number(id)))
      .returning();

    if (deletedEvent.length === 0) {
      return res.status(404).json({ message: "Agenda tidak ditemukan" });
    }

    res.json({ message: "Agenda berhasil dihapus", data: deletedEvent[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus agenda", error });
  }
};