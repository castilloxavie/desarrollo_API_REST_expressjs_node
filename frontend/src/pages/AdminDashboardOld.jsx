import { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTimeBlockForm, setShowTimeBlockForm] = useState(false);
  const [newTimeBlock, setNewTimeBlock] = useState({
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsData, timeBlocksData] = await Promise.all([
        appointmentService.getAllAppointments(),
        appointmentService.getAllTimeBlocks()
      ]);
      setAppointments(appointmentsData);
      setTimeBlocks(timeBlocksData);
    } catch (error) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTimeBlock = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.createTimeBlock(newTimeBlock);
      setNewTimeBlock({ startTime: '', endTime: '' });
      setShowTimeBlockForm(false);
      loadData();
    } catch (error) {
      setError('Error al crear el bloque de tiempo');
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Panel de Administración
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Time Blocks Section */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Bloques de Tiempo
            </h3>
            <button
              onClick={() => setShowTimeBlockForm(!showTimeBlockForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {showTimeBlockForm ? 'Cancelar' : 'Nuevo Bloque'}
            </button>
          </div>

          {showTimeBlockForm && (
            <form onSubmit={handleCreateTimeBlock} className="mb-4 p-4 bg-gray-50 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    required
                    value={newTimeBlock.startTime}
                    onChange={(e) => setNewTimeBlock({...newTimeBlock, startTime: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    required
                    value={newTimeBlock.endTime}
                    onChange={(e) => setNewTimeBlock({...newTimeBlock, endTime: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Crear Bloque
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeBlocks.map((block) => (
              <div key={block.id} className="border rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">
                  {block.startTime} - {block.endTime}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Todas las Reservaciones
          </h3>

          {appointments.length === 0 ? (
            <p className="text-gray-500">No hay reservaciones.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.user?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(appointment.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.timeBlock?.startTime} - {appointment.timeBlock?.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          appointment.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
