import api from "./axios";

export interface ILogData {
  username: string,
  action: string,
  feature: string,
  targetName: string,
}

export const getAllLogs = async () => {
  const response = await api.get("/logs");
  return response.data;
};

export const createLog = async (logData: ILogData) => {
  const response = await api.post("/logs", logData);
  return response.data;
};