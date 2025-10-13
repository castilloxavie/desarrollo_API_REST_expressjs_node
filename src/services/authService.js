const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

class AuthService {
  static async registerUser({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "USER",
        },
      });
      return newUser;
    } catch (error) {
      if (error.code === "P2002") {
        throw new Error("El email ya está registrado");
      }
      throw new Error("Error al crear el usuario");
    }
  }

  static async loginUser({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Credenciales inválidas");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { message: "Login exitoso", token };
  }

  static async getAllDbUsers() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      throw new Error("Error al comunicarse con la base de datos");
    }
  }
}

module.exports = AuthService;
