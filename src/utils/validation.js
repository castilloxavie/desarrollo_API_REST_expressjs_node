const { body, param, query, validationResult } = require('express-validator');

// Validaciones para registro de usuario
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

// Validaciones para login
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

// Validaciones para reservaciones
const validateAppointmentCreation = [
  body('timeBlockId')
    .isInt({ min: 1 })
    .withMessage('timeBlockId debe ser un número entero positivo'),
  body('date')
    .isISO8601()
    .withMessage('La fecha debe estar en formato ISO8601'),
  body('service')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('El servicio debe tener entre 1 y 200 caracteres'),
];

// Validaciones para parámetros de ID
const validateIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
];

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      message: 'Errores de validación',
    });
  }
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateAppointmentCreation,
  validateIdParam,
  handleValidationErrors,
};
