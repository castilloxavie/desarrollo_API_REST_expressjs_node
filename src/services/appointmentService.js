const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

class AppointmentService {
  // Crear reservación (usuario autenticado)
  static async createAppointment({ userId, timeBlockId, date }) {
    // Verificar que el timeBlock existe
    const timeBlock = await prisma.timeBlock.findUnique({
      where: { id: timeBlockId }
    });
    if (!timeBlock) {
      throw new Error("Bloque de tiempo no encontrado");
    }

    // Verificar que no haya conflicto (mismo timeBlock en la misma fecha)
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        timeBlockId,
        date: new Date(date)
      }
    });
    if (existingAppointment) {
      throw new Error("Conflicto: Ya existe una reservación para este bloque de tiempo en la fecha seleccionada");
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        userId,
        timeBlockId,
        date: new Date(date)
      },
      include: {
        user: true,
        timeBlock: true
      }
    });
    return newAppointment;
  }

  // Obtener reservaciones del usuario (usuario autenticado)
  static async getUserAppointments(userId) {
    const appointments = await prisma.appointment.findMany({
      where: { userId },
      include: {
        timeBlock: true
      },
      orderBy: { date: 'asc' }
    });
    return appointments;
  }

  // Obtener reservación por ID (solo si pertenece al usuario o es admin)
  static async getAppointmentById(id, userId, isAdmin = false) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        user: true,
        timeBlock: true
      }
    });
    if (!appointment) {
      throw new Error("Reservación no encontrada");
    }
    if (!isAdmin && appointment.userId !== userId) {
      throw new Error("Acceso denegado");
    }
    return appointment;
  }

  // Actualizar reservación (solo si pertenece al usuario o es admin)
  static async updateAppointment(id, { timeBlockId, date }, userId, isAdmin = false) {
    // Verificar propiedad
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id }
    });
    if (!existingAppointment) {
      throw new Error("Reservación no encontrada");
    }
    if (!isAdmin && existingAppointment.userId !== userId) {
      throw new Error("Acceso denegado");
    }

    // Verificar conflictos si cambian timeBlock o date
    if (timeBlockId || date) {
      const checkTimeBlockId = timeBlockId || existingAppointment.timeBlockId;
      const checkDate = date ? new Date(date) : existingAppointment.date;

      const conflict = await prisma.appointment.findFirst({
        where: {
          timeBlockId: checkTimeBlockId,
          date: checkDate,
          id: { not: id }
        }
      });
      if (conflict) {
        throw new Error("Conflicto con otra reservación");
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(timeBlockId && { timeBlockId }),
        ...(date && { date: new Date(date) })
      },
      include: {
        user: true,
        timeBlock: true
      }
    });
    return updatedAppointment;
  }

  // Eliminar reservación (solo si pertenece al usuario o es admin)
  static async deleteAppointment(id, userId, isAdmin = false) {
    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });
    if (!appointment) {
      throw new Error("Reservación no encontrada");
    }
    if (!isAdmin && appointment.userId !== userId) {
      throw new Error("Acceso denegado");
    }

    await prisma.appointment.delete({
      where: { id }
    });
    return { message: "Reservación eliminada" };
  }

  // Obtener todas las reservaciones (solo admin)
  static async getAllAppointments() {
    const appointments = await prisma.appointment.findMany({
      include: {
        user: true,
        timeBlock: true
      },
      orderBy: { date: 'asc' }
    });
    return appointments;
  }
}

module.exports = AppointmentService;
