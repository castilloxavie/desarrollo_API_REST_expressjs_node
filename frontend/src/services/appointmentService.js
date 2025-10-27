import api from './api';

export const appointmentService = {
  async getUserAppointments() {
    const response = await api.get('/appointments');
    return response.data;
  },

  async createAppointment(appointmentData) {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  async getAppointmentById(id) {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  async updateAppointment(id, appointmentData) {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  async deleteAppointment(id) {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },

  // Admin functions
  async getAllAppointments() {
    const response = await api.get('/admin/appointments');
    return response.data;
  },

  async getAllTimeBlocks() {
    const response = await api.get('/admin/time-blocks');
    return response.data;
  },

  async createTimeBlock(timeBlockData) {
    const response = await api.post('/admin/time-blocks', timeBlockData);
    return response.data;
  }
};
