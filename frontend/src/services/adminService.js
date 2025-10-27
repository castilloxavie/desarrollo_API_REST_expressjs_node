import api from './api';

const adminService = {
  // Obtener todos los bloques de tiempo
  getTimeBlocks: async () => {
    const response = await api.get('/admin/time-blocks');
    return response.data;
  },

  // Crear un bloque de tiempo
  createTimeBlock: async (timeBlockData) => {
    const response = await api.post('/admin/time-blocks', timeBlockData);
    return response.data;
  },

  // Actualizar un bloque de tiempo
  updateTimeBlock: async (id, timeBlockData) => {
    const response = await api.put(`/admin/time-blocks/${id}`, timeBlockData);
    return response.data;
  },

  // Eliminar un bloque de tiempo
  deleteTimeBlock: async (id) => {
    const response = await api.delete(`/admin/time-blocks/${id}`);
    return response.data;
  },

  // Obtener estadísticas del sistema
  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};

export { adminService };
