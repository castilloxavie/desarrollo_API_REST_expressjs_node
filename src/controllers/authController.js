const AuthService = require("../services/authService");
const { body, validationResult } = require('express-validator');

class AuthController {
  static validateRegister = [
    body('name').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email').isEmail().withMessage('Debe proporcionar un email válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ];

  static validateLogin = [
    body('email').isEmail().withMessage('Debe proporcionar un email válido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
  ];

  static async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const newUser = await AuthService.registerUser({ name, email, password });
      res.status(201).json({ message: "Usuario creado", user: newUser });
    } catch (error) {
      if (error.message === "El email ya está registrado") {
        res.status(400).json({ error: error.message });
      } else {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const result = await AuthService.loginUser({ email, password });
      res.json(result);
    } catch (error) {
      console.error("Error al hacer login:", error);
      res.status(401).json({ error: error.message });
    }
  }

  static async getAllDbUsers(req, res) {
    try {
      const users = await AuthService.getAllDbUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async protectedRoute(req, res) {
    res.send("Ruta protegida, usuario autenticado");
  }
}

module.exports = AuthController;
