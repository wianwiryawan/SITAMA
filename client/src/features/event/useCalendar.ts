/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo, useRef } from "react";
import { getAllEvents, createEvent, updateEvent, deleteEvent, generateSPT } from "../../api/event";
import { getAllUsers } from "../../api/user";
import api from "../../api/axios";

export interface IEvent {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: any[];
  type: 'rapat' | 'perdin';
}

export function useCalendar(currentUser: any) {
  const formRef = useRef<HTMLFormElement>(null);
  
  // state utama
  const [viewDate, setViewDate] = useState(new Date());
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // state modal & form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [prefilledDate, setPrefilledDate] = useState("");
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<number[]>([]);
  const [customParticipants, setCustomParticipants] = useState<string[]>([]);
  const [isPemberiModalOpen, setIsPemberiModalOpen] = useState(false);
  const [selectedPemberiId, setSelectedPemberiId] = useState<number | "">("");
  const [isGenerating, setIsGenerating] = useState(false); // Untuk loading state
  
  // state UI lainnya
  const [showMineOnly, setShowMineOnly] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);


  const canEdit = currentUser?.role === 'katim' || currentUser?.role === 'kasubdit';

  // fetch data
  const fetchEventsData = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error("Gagal memuat agenda:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setAllUsers(data);
      } catch (err) {
        console.error("Gagal ambil daftar user", err);
      }
    };
    fetchUsers();
    fetchEventsData();
  }, []);

  // Sync participants saat modal edit dibuka
  useEffect(() => {
    if (selectedEvent) {
      const ids = selectedEvent.participants.map((p: any) => p.userId);
      setSelectedParticipantIds(ids);
      // Jika ada external_participants string, pecah jadi array
      // setCustomParticipants(selectedEvent.external_participants?.split(', ') || []);
    } else {
      setSelectedParticipantIds([]);
      setCustomParticipants([]);
    }
  }, [selectedEvent, isModalOpen]);

  // logika tanggal
  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const todayDate = normalizeDate(new Date());
  const todayTime = todayDate.getTime();

  const isSameMonth = (event: IEvent) => {
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getMonth() === viewDate.getMonth() &&
      eventDate.getFullYear() === viewDate.getFullYear()
    );
  };

  const isPastEvent = (event: IEvent) => normalizeDate(new Date(event.endDate)).getTime() < todayTime;
  const isTodayEvent = (event: IEvent) => normalizeDate(new Date(event.startDate)).getTime() === todayTime;

  // filter dan sort agenda
  const filteredAgenda = useMemo(() => {
    return events
      .filter(e => isSameMonth(e))
      .filter(e => {
        if (!showMineOnly) return true;
        return e.participants?.some((p: any) => p.user?.username === currentUser.username);
      })
      .sort((a, b) => {
        const aPast = isPastEvent(a);
        const bPast = isPastEvent(b);
        if (aPast !== bPast) return aPast ? 1 : -1;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
  }, [events, viewDate, showMineOnly, currentUser]);

  // Cari next agenda yang terdekat
  const nextEventId = useMemo(() => {
    return [...filteredAgenda]
      .filter(e => normalizeDate(new Date(e.startDate)).getTime() > todayTime)
      .sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return a.startTime.localeCompare(b.startTime);
      })[0]?.id;
  }, [filteredAgenda, todayTime]);

  const isNextEvent = (event: IEvent) => event.id === nextEventId;

  // kalender 
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const padding = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < padding; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [viewDate]);

  // action
  const handleDateClick = (day: number) => {
    // if (!canEdit) return;
    const dateStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setPrefilledDate(dateStr);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const sd = formData.get('startDate') as string;
    const ed = formData.get('endDate') as string;
    const st = formData.get('startTime') as string;
    const et = formData.get('endTime') as string;

    // Validasi
    if (ed < sd) return alert("Tanggal selesai tidak boleh sebelum tanggal mulai!");
    if (sd === ed && et <= st) return alert("Jam selesai harus lebih lama!");

    const eventData: any = {
      title: formData.get('title'),
      startDate: sd,
      endDate: ed,
      startTime: st,
      endTime: et,
      location: formData.get('location'),
      type: formData.get('type'),
      participants: selectedParticipantIds,
      external_participants: customParticipants.join(', '),
    };

    try {
      if (selectedEvent) {
        await updateEvent(selectedEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }
      await fetchEventsData();
      setIsModalOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 10000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal simpan");
    }
  };

  const handleDelete = async () => {
  if (!selectedEvent) return;

  const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus agenda "${selectedEvent.title}"?`);
  
  if (confirmDelete) {
    try {
      await deleteEvent(selectedEvent.id);
      setIsModalOpen(false);
      fetchEventsData();
      
      alert("Agenda berhasil dihapus"); 
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus agenda");
    }
  }
  };

  const handleOpenGenerateST = (e: React.MouseEvent) => {
    console.log("modal kecil terbuka")
    e.preventDefault();
    
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    
    const title = formData.get('title');
    const startDate = formData.get('startDate');

    if (!title || !startDate) {
      alert("Lengkapi Judul dan Tanggal Agenda terlebih dahulu.");
      return;
    }
    setIsPemberiModalOpen(true);
  };

  // handle generate st (html to pdf)
  const handleGenerateST = async () => {
    if (!formRef.current || !selectedPemberiId) return;
    
    const formData = new FormData(formRef.current);
    setIsGenerating(true);
    
    try {
      const pelaksanaData = allUsers
        .filter(u => selectedParticipantIds.includes(u.id))
        .map(u => ({ 
          name: u.name,
          nip: u.nip,
          pangkat: u.pangkat,
          role: u.role,
        }));

      customParticipants.forEach(name => {
        pelaksanaData.push({ username: name, nip: '-', pangkat: '-', role: 'Eksternal' } as any);
      });

      const payload = {
        title: formData.get('title'),
        location: formData.get('location'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        pelaksanaId: selectedParticipantIds,
        pelaksana: pelaksanaData,
        pemberiTugasId: Number(selectedPemberiId),
      };

      const response = await api.post('/generate-st', payload, {
        responseType: 'blob', 
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Surat_Tugas_${String(payload.title).replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setIsPemberiModalOpen(false);
    } catch (error) {
      console.error("Gagal Generate ST:", error);
      alert("Gagal membuat PDF. Cek koneksi server.");
    } finally {
      setIsGenerating(false);
    }
  };

  //handle generate ST (docx to docx)
//   const handleGenerateST = async () => {
//     if (!formRef.current || !selectedPemberiId) return;
    
//     const formData = new FormData(formRef.current);
//     setIsGenerating(true);
    
//     try {
//       const pelaksanaData = allUsers
//         .filter(u => selectedParticipantIds.includes(u.id))
//         .map(u => ({ 
//           name: u.name,
//           nip: u.nip,
//           pangkat: u.pangkat,
//           jabatan: u.jabatan,
//           role: u.role,
//         }));

//       // customParticipants.forEach(name => {
//       //   pelaksanaData.push({ name: name, nip: '-', pangkat: '-', role: 'Eksternal' } as any);
//       // });

//       const payload = {
//         title: formData.get('title'),
//         location: formData.get('location'),
//         startDate: formData.get('startDate'),
//         endDate: formData.get('endDate'),
//         pelaksanaId: selectedParticipantIds,
//         pelaksana: pelaksanaData,
//         pemberiTugasId: Number(selectedPemberiId),
//       };

//       const response = await api.post('/generate-st', payload, {
//         responseType: 'blob', // Tetap blob karena kita menerima file mentah
//       });

//       const blob = new Blob([response.data], { 
//   type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
// });const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;

//       // Pastikan nama file sudah sesuai (.docx)
//       const safeTitle = String(payload.title)
//   .replace(/[^\w\s-]/g, '')
//   .replace(/\s+/g, '_');

// const fileName = `ST_${safeTitle}.docx`;
//       link.setAttribute('download', fileName);
      
//       // Prosedur standar download (tetap sama)
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       setIsPemberiModalOpen(false); 
//     } catch (error: any) {
//   console.error("full error:", error);
//   console.error("res error:", error?.response);
//   console.error("data error:", error?.response?.data);
  
//   alert("Gagal membuat file Word. Cek console.");
//     } finally {
//       setIsGenerating(false); // Matikan loading state
//     }
//   };

  const handleGenerateSPT = async () => {
  if (!formRef.current) return;
  
  const formData = new FormData(formRef.current);
  setIsGenerating(true);
  
  
  try {
    const pelaksanaData = allUsers
        .filter(u => selectedParticipantIds.includes(u.id))
        .map(u => ({ 
          name: u.name,
          nip: u.nip,
          pangkat: u.pangkat,
          role: u.role,
        }));

    const payload = {
      title: formData.get('title'),
      location: formData.get('location'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      pelaksanaId: selectedParticipantIds,
      pelaksana: pelaksanaData,
    };

    const response = await api.post('/generate-spt', payload, {
      responseType: 'blob', 
    });

    const url = window.URL.createObjectURL(response.data);

    // const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    link.setAttribute('download', `SPT_${String(payload.title)}.docx`);
    
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    setIsModalOpen(false); 
    console.log("handle generate spt berhasil");
  } catch (error: any) {
    console.error("Gagal Generate SPT:", error);
    console.log("gagal",error);
    alert("SPT Generator is coming soonnn!");
  } finally {
    setIsGenerating(false);
  }
};

  return {
    formRef,
    // Data & Logic
    viewDate, setViewDate,
    events, loading,
    calendarDays,
    filteredAgenda,
    nextEventId,
    allUsers,
    canEdit,
    
    // UI State
    isModalOpen, setIsModalOpen,
    selectedEvent, setSelectedEvent,
    prefilledDate,
    showMineOnly, setShowMineOnly,
    showToast,
    
    // Participant State
    selectedParticipantIds, setSelectedParticipantIds,
    customParticipants, setCustomParticipants,
    isDropdownOpen, setIsDropdownOpen,
    searchTerm, setSearchTerm,
    isPemberiModalOpen, setIsPemberiModalOpen,
    selectedPemberiId, setSelectedPemberiId,
    isGenerating, setIsGenerating,

    // Functions
    handleDateClick,
    handleSave,
    handleDelete,
    isPastEvent,
    isTodayEvent,
    isNextEvent,
    normalizeDate,
    handleGenerateST,
    handleOpenGenerateST,
    handleGenerateSPT,
  };
}