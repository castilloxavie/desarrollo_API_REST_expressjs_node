const AppointmentService = require("../services/appointmentService");
const { body, validationResult } = require('express-validator');

class AppointmentController {
  static validateCreateAppointment = [
    body('timeBlockId').isInt({ min: 1 }).withMessage('timeBlockId debe ser un número entero positivo'),
    body('date').isISO8601().withMessage('date debe ser una fecha válida en formato ISO'),
  ];

  static validateUpdateAppointment = [
    body('timeBlockId').optional().isInt({ min: 1 }).withMessage('timeBlockId debe ser un número entero positivo'),
    body('date').optional().isISO8601().withMessage('date debe ser una fecha válida en formato ISO'),
  ];

  // Crear reservación (usuario autenticado)
  static async createAppointment(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { timeBlockId, date } = req.body;
      const userId = req.user.id;

      const newAppointment = await AppointmentService.createAppointment({
        userId,
        timeBlockId: parseInt(timeBlockId),
        date
      });

      res.status(201).json(newAppointment);
    } catch (error) {
      console.error("Error creando reservación:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Obtener reservaciones del usuario
  static async getUserAppointments(req, res) {
    try {
      const userId = req.user.id;
      const appointments = await AppointmentService.getUserAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error obteniendo reservaciones:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener reservación por ID
  static async getAppointmentById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const isAdmin = req.user.role === "ADMIN";

      const appointment = await AppointmentService.getAppointmentById(
        parseInt(id),
        userId,
        isAdmin
      );

      res.json(appointment);
    } catch (error) {
      console.error("Error obteniendo reservación:", error);
      if (error.message === "Acceso denegado") {
        res.status(403).json({ error: error.message });
      } else {
        res.status(404).json({ error: error.message });
      }
    }
  }

  // Actualizar reservación
  static async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const { timeBlockId, date } = req.body;
      const userId = req.user.id;
      const isAdmin = req.user.role === "ADMIN";

      if (!timeBlockId && !date) {
        return res.status(400).json({ error: "Al menos timeBlockId o date deben proporcionarse" });
      }

      const updatedAppointment = await AppointmentService.updateAppointment(
        parseInt(id),
        { timeBlockId: timeBlockId ? parseInt(timeBlockId) : undefined, date },
        userId,
        isAdmin
      );

      res.json(updatedAppointment);
    } catch (error) {
      console.error("Error actualizando reservación:", error);
      if (error.message === "Acceso denegado") {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  // Eliminar reservación
  static async deleteAppointment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const isAdmin = req.user.role === "ADMIN";

      const result = await AppointmentService.deleteAppointment(
        parseInt(id),
        userId,
        isAdmin
      );

      res.json(result);
    } catch (error) {
      console.error("Error eliminando reservación:", error);
      if (error.message === "Acceso denegado") {
        res.status(403).json({ error: error.message });
      } else {
        res.status(404).json({ error: error.message });
      }
    }
  }

  // Obtener todas las reservaciones (solo admin)
  static async getAllAppointments(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Acceso denegado" });
      }

      const appointments = await AppointmentService.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error obteniendo todas las reservaciones:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AppointmentController;
