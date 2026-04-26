export const formatDateRange = (startStr: string, endStr: string) => {
  const start = new Date(startStr);
  const end = new Date(endStr);

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const d1 = start.getDate();
  const m1 = start.getMonth();
  const y1 = start.getFullYear();

  const d2 = end.getDate();
  const m2 = end.getMonth();
  const y2 = end.getFullYear();

  // 1. Jika tanggalnya sama 
  if (startStr === endStr) {
    return `${d1} ${months[m1]} ${y1}`;
  }

  // 2. Jika tahunnya sama
  if (y1 === y2) {
    // Jika bulannya sama 
    if (m1 === m2) {
      return `${d1} - ${d2} ${months[m1]} ${y1}`;
    }
    // Jika bulannya beda 
    return `${d1} ${months[m1]} - ${d2} ${months[m2]} ${y1}`;
  }

  // 3. Jika tahunnya beda 
  return `${d1} ${months[m1]} ${y1} - ${d2} ${months[m2]} ${y2}`;
};

export const calculateDuration = (startDate: string, endDate: string): string => {
  if (!startDate || !endDate) return "-";

  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(12, 0, 0, 0);
  end.setHours(12, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();
  
  // Konversi ke hari dan tambah 1 (karena hari berangkat & pulang dihitung)
  const finalDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return `${finalDays}`;
};