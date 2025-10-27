const { format, parseISO, isValid, addDays, isAfter, isBefore } = require('date-fns');

// Formatear fecha para display
const formatDate = (date, formatString = 'yyyy-MM-dd') => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

// Formatear hora para display
const formatTime = (date, formatString = 'HH:mm') => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatString);
  } catch (error) {
    console.error('Error formatting time:', error);
    return null;
  }
};

// Validar si una fecha es válida
const isValidDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch (error) {
    return false;
  }
};

// Verificar si una fecha está en el futuro
const isFutureDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    return isAfter(date, now);
  } catch (error) {
    return false;
  }
};

// Verificar si una fecha está en el pasado
const isPastDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    return isBefore(date, now);
  } catch (error) {
    return false;
  }
};

// Agregar días a una fecha
const addDaysToDate = (dateString, days) => {
  try {
    const date = parseISO(dateString);
    const newDate = addDays(date, days);
    return format(newDate, 'yyyy-MM-dd');
  } catch (error) {
    return null;
  }
};

// Obtener fecha actual en formato ISO
const getCurrentISODate = () => {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

module.exports = {
  formatDate,
  formatTime,
  isValidDate,
  isFutureDate,
  isPastDate,
  addDaysToDate,
  getCurrentISODate,
};
