const express = require("express");
const GeneralController = require("../controllers/generalController");

const router = express.Router();

// Página principal
router.get("/", GeneralController.home);

// Ejemplo de ruta con parámetro de URL
router.get("/user/:id", GeneralController.getUserById);

// Ejemplo de ruta con parámetros query
router.get("/search", GeneralController.search);

// Ruta para recibir formulario
router.post("/form", GeneralController.handleForm);

// Ruta para probar JSON
router.post("/api/data", GeneralController.handleJsonData);

//errores endpoint
router.get("/error", GeneralController.triggerError);

// Importar rutas versionadas
const authRoutes = require("./v1/auth");
const appointmentRoutes = require("./v1/appointment");
const adminRoutes = require("./v1/admin");

// Rutas versionadas
router.use("/auth", authRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
