const app = require("./app");
const { PORT } = require("./config/environment");

//Inicializar servidor
app.listen(PORT, () => {
  console.log(
    `Servidor funcionando en http://localhost:${PORT}`
  );
});
