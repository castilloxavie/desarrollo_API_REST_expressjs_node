const express = require("express");
const AuthController = require("../controllers/authController");
const authenticateToken = require("../middlewares/auth.cjs");

const router = express.Router();

// Obtener todos los usuarios de la DB
router.get("/db-users", AuthController.getAllDbUsers);

// Ruta protegida
router.get("/protegida", authenticateToken, AuthController.protectedRoute);

// Registro de usuario
router.post("/registro", AuthController.register);

// Login de usuario
router.post("/login", AuthController.login);

module.exports = router;
