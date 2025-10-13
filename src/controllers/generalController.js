class GeneralController {
  static home(req, res) {
    const PORT = process.env.PORT || 3000;
    res.send(`
      <h1>Curso Express V2</h1>
      <p>Aplicación con Express y Node.js</p>
      <p>Corriendo en el puerto: ${PORT}</p>
    `);
  }

  static getUserById(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }
    res.send(`Mostrar usuario con id: ${id}`);
  }

  static search(req, res) {
    const term = req.query.termino?.trim() || "No especificado";
    const category = req.query.categoria?.trim() || "todas";

    res.send(`
      <h2>Resultado de búsqueda</h2>
      <p>Término: ${term}</p>
      <p>Categoría: ${category}</p>
    `);
  }

  static handleForm(req, res) {
    const name = req.body.nombre?.trim();
    const email = req.body.email?.trim();

    if (!name || !email) {
      return res.status(400).json({
        error: "Debe proporcionar nombre y correo electrónico válidos",
      });
    }

    res.status(200).json({
      message: "Datos recibidos correctamente",
      data: { name, email },
    });
  }

  static handleJsonData(req, res) {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No se enviaron datos válidos" });
    }
    res.status(200).json({ message: "Datos JSON recibidos", data });
  }

  static triggerError(req, res, next) {
    next(new Error("error de prueba"));
  }
}

module.exports = GeneralController;
