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