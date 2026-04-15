/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../../api/axios";

export const useActivityLog = (currentUser: any) => {
  const saveLog = async (action: string, feature: 'TASK' | 'CALENDAR', targetName: string) => {
    const logData = {
      username: currentUser.username, 
      action: action,
      feature: feature,
      targetName: targetName,
    };

    try {
      await api.post('/logs', logData);
    } catch (err) {
      console.error("Gagal mencatat log ke database", err);
    }
  };

  return { saveLog };
};