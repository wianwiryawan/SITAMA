import api from './axios'; 

export interface IEventData {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'rapat' | 'perdin';
  participants: number[];
}

export const getAllEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const createEvent = async (eventData: IEventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const updateEvent = async (id: number, eventData: Partial<IEventData>) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: number) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

export const generateST = async (eventData: IEventData) => {
  const response = await api.post('/generate-st', eventData, {
    responseType: 'blob', 
  });
  return response.data; 
};

export const generateSPT = async (eventData: IEventData) => {
  const response = await api.post('/generate-spt', eventData, {
    responseType: 'blob', 
  });
  return response.data; 
};