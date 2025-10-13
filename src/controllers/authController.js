const AuthService = require("../services/authService");

class AuthController {
  static async register(req, res) {
    if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({
        error: "Debe proporcionar name, email y password válidos",
      });
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
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({
        error: "Debe proporcionar email y password válidos",
      });
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
