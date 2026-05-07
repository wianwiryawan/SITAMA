import { Request, Response } from 'express';
import { db } from '../db';
import { events, eventParticipants, users } from '../db/schema';
import { and, eq, inArray, lte, gte } from 'drizzle-orm';
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import { calculateDuration, formatDateRange } from './utils';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { Document, Packer, Paragraph } from 'docx';

Handlebars.registerHelper("inc", (value: number) => {
  return (value || 0) + 1;
});

export const eventController = {

  getAllEvents: async (req: Request, res: Response) => {
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
  },

  createEvent: async (req: Request, res: Response) => {
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
  },

  updateEvent: async (req: Request, res: Response) => {
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
  },

  deleteEvent: async (req: Request, res: Response) => {
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
  },

  //generate ST (html to pdf)
    generateST: async (req: Request, res: Response) => {
  let browser; 
  try {
  
    const { location, startDate, endDate, title, pelaksanaId, pemberiTugasId } = req.body;
    console.log("req-body",req.body);
    if (!pemberiTugasId || !pelaksanaId || pelaksanaId.length === 0) {
      return res.status(400).json({ message: "Data surat tidak lengkap" });
    }

    const [infoPemberi] = await db.select()
      .from(users)
      .where(eq(users.id, pemberiTugasId))
      .limit(1);

    if (!infoPemberi) {
      return res.status(404).json({ message: "Pemberi tugas tidak ditemukan" });
    }

    const daftarPelaksana = await db.select({
        name: users.name,
        nip: users.nip,
        pangkat: users.pangkat,
        jabatan: users.jabatan
      })
      .from(users)
      .where(inArray(users.id, pelaksanaId));

    const formattedDate = formatDateRange(startDate, endDate);

    const templatePath = path.join(__dirname, "./templateST.html");
    if (!fs.existsSync(templatePath)) throw new Error("Template tidak ditemukan");

    const html = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(html);

    const finalHtml = template({
      lokasi: location || "-",
      tanggal: formattedDate ,
      agenda: title ,
      pegawai: daftarPelaksana || "-", 
      namaPemberi: infoPemberi.name || "-",
      nipPemberi: infoPemberi.nip ,
      pangkatPemberi: infoPemberi.pangkat || "-",
      jabatanPemberi: infoPemberi.jabatan || "-",
      
    });

    // Generate PDF (Puppeteer)
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", 
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"],
    });

    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0.5cm", right: "0.5cm", bottom: "2cm", left: "0.5cm" }
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=ST_${title}.pdf`);
    return res.send(pdfBuffer);

  } catch (error: any) {
    console.error("PDF Error:", error);
    return res.status(500).json({ message: "Gagal generate ST (be)", error: error.message, stack: error.stack});
  } finally {
    if (browser) await browser.close();
  }
  },
  
  //generateST docx to docx
  generateSTDocx: async (req: Request, res: Response) => {

  try {
    console.log("STEP 1: masuk endpoint");
  const { location, startDate, endDate, title, pelaksanaId, pemberiTugasId } = req.body;

console.log("STEP 2: body done");
  const [infoPemberi] = await db.select().from(users).where(eq(users.id, pemberiTugasId)).limit(1);
  console.log("STEp 3: info pemberi done");
  const daftarPelaksana = await db.select({
    name: users.name, nip: users.nip, pangkat: users.pangkat, jabatan: users.jabatan
  }).from(users).where(inArray(users.id, pelaksanaId));
console.log("STEP 4: daftarPelaksana done");
  const formattedDate = formatDateRange(startDate, endDate);
console.log("STEP 5: formatdaterange done");
  const templatePath = path.resolve("src/controllers/templateST.docx");
  if (!fs.existsSync(templatePath)) throw new Error("Template .docx tidak ditemukan");
console.log("STEP 6: buka template done");
  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);
  
  try {
  const doc = new Docxtemplater(zip, {
  delimiters: {
    start: "[[",
    end: "]]",
  },
  paragraphLoop: true,
  linebreaks: true,
});

  const data = {
  lokasi: location || "-",
  tanggal: formattedDate,
  agenda: title,
  pegawai: daftarPelaksana.map((item, index) => ({
    no: index + 1,
    ...item
  })),
  namaPemberi: infoPemberi?.name || "-",
  nipPemberi: infoPemberi?.nip || "-",
  pangkatPemberi: infoPemberi?.pangkat || "-",
  jabatanPemberi: infoPemberi?.jabatan || "-",
};

console.log("data untuk docx:");
console.log(JSON.stringify(data, null, 2));

try {
  doc.render(data);
  console.log("RENDER BERHASIL");
} catch (error: any) {
  console.log("docx full error:");
  console.log(JSON.stringify(error, null, 2));

  return res.status(500).json({
    message: "Template error",
    error: error.message,
  });
}

  // 4. Generate Buffer
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  res.setHeader("Content-Disposition", `attachment; filename=ST_${title.replace(/\s+/g, '_')}.docx`);
  
  return res.send(buf);

} catch (error: any) {
  console.error("Detail Error:", error);
  return res.status(500).json({ 
    message: "Gagal generate ST", 
    debug: error.message,
    stack: error.stack 
  })
}
} catch (error: any) {
  console.log("DETAIL ERROR DOCX:");
  console.log(JSON.stringify(error, null, 2));
  throw error;
}
  },

    //generateST docx to docx
  generateSPT: async (req: Request, res: Response) => {

  try {
    console.log("STEP 1: masuk endpoint");
  const { location, startDate, endDate, title, pelaksanaId, pemberiTugasId } = req.body;

console.log("STEP 2: body done");
  const daftarPelaksana = await db.select({
    name: users.name, nip: users.nip, pangkat: users.pangkat, jabatan: users.jabatan
  }).from(users).where(inArray(users.id, pelaksanaId));
console.log("STEP 4: daftarPelaksana done");
  const formattedDate = formatDateRange(startDate, endDate);
console.log("STEP 5: formatdaterange done");
  const templatePath = path.resolve("src/controllers/templateSPT.docx");
  if (!fs.existsSync(templatePath)) throw new Error("Template .docx tidak ditemukan");
console.log("STEP 6: buka template done");
  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);
  
  try {
  const doc = new Docxtemplater(zip, {
  delimiters: {
    start: "[[",
    end: "]]",
  },
  paragraphLoop: true,
  linebreaks: true,
});

  const data = {
  lokasi: location || "-",
  tanggal: formattedDate,
  agenda: title,
  pegawai: daftarPelaksana.map((item, index) => ({
    no: index + 1,
    ...item
  })),
};

console.log("data untuk docx:");
console.log(JSON.stringify(data, null, 2));

try {
  doc.render(data);
  console.log("RENDER BERHASIL");
} catch (error: any) {
  console.log("docx full error:");
  console.log(JSON.stringify(error, null, 2));

  return res.status(500).json({
    message: "Template error",
    error: error.message,
  });
}

  // 4. Generate Buffer
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  res.setHeader("Content-Disposition", `attachment; filename=ST_${title.replace(/\s+/g, '_')}.docx`);
  
  return res.send(buf);

} catch (error: any) {
  console.error("Detail Error:", error);
  return res.status(500).json({ 
    message: "Gagal generate ST", 
    debug: error.message,
    stack: error.stack 
  })
}
} catch (error: any) {
  console.log("DETAIL ERROR DOCX:");
  console.log(JSON.stringify(error, null, 2));
  throw error;
}
  }
};