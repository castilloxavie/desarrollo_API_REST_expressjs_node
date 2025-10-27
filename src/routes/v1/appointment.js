const express = require("express");
const AppointmentController = require("../../controllers/appointmentController");
const authenticateToken = require("../../middlewares/auth.cjs");

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Crear reservación
router.post("/", AppointmentController.validateCreateAppointment, AppointmentController.createAppointment);

// Obtener reservaciones del usuario
router.get("/", AppointmentController.getUserAppointments);

// Obtener reservación específica
router.get("/:id", AppointmentController.getAppointmentById);

// Actualizar reservación
router.put("/:id", AppointmentController.validateUpdateAppointment, AppointmentController.updateAppointment);

// Eliminar reservación
router.delete("/:id", AppointmentController.deleteAppointment);

module.exports = router;
