const app = require("./app");
const PORT = process.env.PORT || 3000;

//Inicializar servidor
app.listen(PORT, () => {
  console.log(
    `Servidor funcionando en http://localhost:${PORT}`
  );
});
