const express = require("express");
const AuthController = require("../../controllers/authController");
const authenticateToken = require("../../middlewares/auth.cjs");
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP
  message: 'Demasiados intentos de autenticación, intenta de nuevo en 15 minutos',
  standardHeaders: true,
  legacyHeaders: false,
});

// Obtener todos los usuarios de la DB
router.get("/db-users", authenticateToken, AuthController.getAllDbUsers);

// Ruta protegida
router.get("/protegida", authenticateToken, AuthController.protectedRoute);

// Registro de usuario
router.post("/registro", authLimiter, AuthController.validateRegister, AuthController.register);

// Login de usuario
router.post("/login", authLimiter, AuthController.validateLogin, AuthController.login);

module.exports = router;
