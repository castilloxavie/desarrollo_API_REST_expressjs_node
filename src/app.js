const express = require("express");
const { PORT } = require("./config/environment");
const loggerMiddlewares = require("./middlewares/logger");
const errorHandler = require("./middlewares/error");

// Importar rutas
const indexRoutes = require("./routes/index");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddlewares);

// Rutas
app.use("/", indexRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;
