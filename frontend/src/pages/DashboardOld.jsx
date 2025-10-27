import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await appointmentService.getUserAppointments();
      setAppointments(data);
    } catch (error) {
      setError('Error al cargar las reservaciones');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.name}
        </h1>
        <Link
          to="/appointments/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nueva Reservación
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Mis Reservaciones
          </h3>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tienes reservaciones aún.</p>
            <Link
              to="/appointments/new"
              className="text-blue-600 hover:text-blue-500 mt-2 inline-block"
            >
              Crear tu primera reservación
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.timeBlock?.startTime} - {appointment.timeBlock?.endTime}
                    </p>
                    <p className="text-sm text-gray-500">
                      Fecha: {formatDate(appointment.date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Estado: {appointment.status}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/appointments/${appointment.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
