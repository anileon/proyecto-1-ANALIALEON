


// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas } = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3008;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
   res.send(BD);
});

app.get('/nombres/:nombre', (req, res) =>{ //obtener fruta por el nombre
  let search = req.params.nombre.trim();
  const result = BD.filter(producto => producto.nombre.toLowerCase().includes(search.toLowerCase()));
  result.length > 0  ? res.json(result) : res.json([{ id: "Error", descripcion: "No se encontraron coincidencias en los nombres." }
  ]);
});

app.get('/id/:id', (req, res) =>{   //un find para devolver una sola fruta por el id
  let iden = parseInt(req.params.id);
  const result = BD.find(i => i.id === iden);
  result ? res.json(result) : res.json([
  { id: "Error", descripcion: "No se encontraron coincidencias de id." },
  ]);
});

app.delete('/',(req,res) => { //prototipo de delete borra el ultimo obj del array BD
  BD.pop();
  guardarFrutas(BD);
  res.status(200).send('fruta eliminada!');
});

app.put('/id/:id', (req, res) =>{   //un find para devolver una sola fruta por el id y cambiarla o crear fruta si no existe
  let iden = parseInt(req.params.id);
  const result = BD.find(i => i.id === iden);
  console.log(result);
  if(result){
    const find = elment => elment === result;
    //console.log(BD[BD.findIndex(find)]);
    const otraFruta = req.body;
    //console.log(otraFruta)
    BD[BD.findIndex(find)] = otraFruta
    guardarFrutas(BD);
    res.status(200).send("Se cambiaron los valores correctamente")
  } else {
    const nuevaFruta = req.body;
    BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
    guardarFrutas(BD); // Guardar los cambios en el archivo
    res.status(201).send("Fruta agregada!")
  }
});

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
    const nuevaFruta = req.body;
    BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
    guardarFrutas(BD); // Guardar los cambios en el archivo
    res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});

// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
  res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});