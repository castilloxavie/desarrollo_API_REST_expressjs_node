import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';

const NewAppointment = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    service: 'Consulta General'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await appointmentService.createAppointment(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al crear la reservación');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (success) {
    return (
      <div className="fade-in">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            ¡Reservación Creada!
          </h1>
          <p className="text-gray-600 mb-4">
            Tu reservación ha sido creada exitosamente. Serás redirigido a tu dashboard.
          </p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Nueva Reservación</h1>
          <p className="card-subtitle">Completa los datos para crear tu reservación</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Fecha
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                min={getTomorrowDate()}
                className="form-input"
                value={formData.date}
                onChange={handleChange}
              />
              <small className="text-gray-500">Selecciona una fecha futura</small>
            </div>

            <div className="form-group">
              <label htmlFor="time" className="form-label">
                Hora
              </label>
              <select
                id="time"
                name="time"
                required
                className="form-select"
                value={formData.time}
                onChange={handleChange}
              >
                <option value="">Selecciona una hora</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="service" className="form-label">
              Servicio
            </label>
            <select
              id="service"
              name="service"
              required
              className="form-select"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="Consulta General">Consulta General</option>
              <option value="Consulta Especializada">Consulta Especializada</option>
              <option value="Revisión Médica">Revisión Médica</option>
              <option value="Tratamiento">Tratamiento</option>
              <option value="Seguimiento">Seguimiento</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Creando reservación...
                </>
              ) : (
                'Crear Reservación'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointment;
