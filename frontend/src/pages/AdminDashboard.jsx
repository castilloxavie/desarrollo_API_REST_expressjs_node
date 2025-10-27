import { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { adminService } from '../services/adminService';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    if (activeTab === 'appointments') {
      loadAppointments();
    } else {
      loadTimeBlocks();
    }
  }, [activeTab]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAllAppointments();
      setAppointments(data);
    } catch (error) {
      setError('Error al cargar las reservaciones');
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTimeBlocks = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTimeBlocks();
      setTimeBlocks(data);
    } catch (error) {
      setError('Error al cargar los bloques de tiempo');
      console.error('Error loading time blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5); // HH:MM
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { class: 'status-confirmed', text: 'Confirmada' },
      pending: { class: 'status-pending', text: 'Pendiente' },
      cancelled: { class: 'status-cancelled', text: 'Cancelada' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      loadAppointments(); // Recargar la lista
    } catch (error) {
      setError('Error al actualizar el estado');
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando datos del panel administrativo...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Panel Administrativo</h1>
          <p className="card-subtitle">Gestiona reservaciones y bloques de tiempo</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'appointments'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Todas las Reservaciones
          </button>
          <button
            onClick={() => setActiveTab('timeblocks')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'timeblocks'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bloques de Tiempo
          </button>
        </div>

        {activeTab === 'appointments' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Todas las Reservaciones</h2>
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No hay reservaciones
                </h3>
                <p className="text-gray-500">
                  Las reservaciones aparecerán aquí cuando los usuarios las creen
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Servicio</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.user?.name || 'Usuario desconocido'}</td>
                        <td>{formatDate(appointment.date)}</td>
                        <td>{formatTime(appointment.time)}</td>
                        <td>{appointment.service || 'Consulta General'}</td>
                        <td>{getStatusBadge(appointment.status)}</td>
                        <td>
                          <select
                            value={appointment.status}
                            onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                            className="form-select text-sm"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmar</option>
                            <option value="cancelled">Cancelar</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeblocks' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Bloques de Tiempo Disponibles</h2>
            {timeBlocks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">⏰</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No hay bloques de tiempo configurados
                </h3>
                <p className="text-gray-500">
                  Configura los bloques de tiempo disponibles para reservaciones
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeBlocks.map((block) => (
                  <div key={block.id} className="card">
                    <div className="card-header">
                      <h3 className="card-title text-lg">{formatDate(block.date)}</h3>
                    </div>
                    <div className="space-y-2">
                      {block.times.map((time, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>{formatTime(time)}</span>
                          <span className="status-badge status-confirmed">Disponible</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
