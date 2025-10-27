const {Router} = require("express");
const {createTimeBlock, listReservations} = require("../../controllers/adminController");
const AppointmentController = require("../../controllers/appointmentController");
const authenticateToken = require("../../middlewares/auth.cjs");
const authorizeRole = require("../../middlewares/authorizeRole");

const router = Router();

// Time blocks
router.get("/time-blocks", authenticateToken, authorizeRole('ADMIN'), (req, res) => {
  // Listar time blocks disponibles
  const { PrismaClient } = require("../../generated/prisma");
  const prisma = new PrismaClient();
  prisma.timeBlock.findMany().then(timeBlocks => res.json(timeBlocks)).catch(err => res.status(500).json({error: err.message}));
});
router.post("/time-blocks", authenticateToken, authorizeRole('ADMIN'), createTimeBlock);

// Reservaciones (admin puede ver todas)
router.get("/appointments", authenticateToken, authorizeRole('ADMIN'), AppointmentController.getAllAppointments);
router.get("/appointments/:id", authenticateToken, authorizeRole('ADMIN'), AppointmentController.getAppointmentById);
router.put("/appointments/:id", authenticateToken, authorizeRole('ADMIN'), AppointmentController.updateAppointment);
router.delete("/appointments/:id", authenticateToken, authorizeRole('ADMIN'), AppointmentController.deleteAppointment);

// Alias para compatibilidad
router.get("/reservation", authenticateToken, authorizeRole('ADMIN'), listReservations);

module.exports = router;
