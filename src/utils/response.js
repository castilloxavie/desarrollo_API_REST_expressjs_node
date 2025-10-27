const { HTTP_STATUS } = require('../config/constants');

// Helpers para respuestas HTTP estándar
const sendSuccess = (res, data, message = 'Operación exitosa', statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message = 'Error interno del servidor', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const sendCreated = (res, data, message = 'Recurso creado exitosamente') => {
  return sendSuccess(res, data, message, HTTP_STATUS.CREATED);
};

const sendBadRequest = (res, message = 'Datos inválidos', errors = null) => {
  return sendError(res, message, HTTP_STATUS.BAD_REQUEST, errors);
};

const sendUnauthorized = (res, message = 'No autorizado') => {
  return sendError(res, message, HTTP_STATUS.UNAUTHORIZED);
};

const sendForbidden = (res, message = 'Acceso denegado') => {
  return sendError(res, message, HTTP_STATUS.FORBIDDEN);
};

const sendNotFound = (res, message = 'Recurso no encontrado') => {
  return sendError(res, message, HTTP_STATUS.NOT_FOUND);
};

module.exports = {
  sendSuccess,
  sendError,
  sendCreated,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
};
