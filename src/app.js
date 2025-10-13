const express = require("express");
require("dotenv").config();
const loggerMiddlewares = require("./middlewares/logger");
const errorHandler = require("./middlewares/error");

// Importar rutas
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddlewares);

// Rutas
app.use("/", indexRoutes);
app.use("/", authRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;
