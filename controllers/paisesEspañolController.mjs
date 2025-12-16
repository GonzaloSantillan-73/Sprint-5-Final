// Importamos las funciones que hacen el trabajo con la base de datos (Servicios)
import { obtenerTodosLosPaisesEspañol, eliminarPais, agregarPais, obtenerPais, actualizarPais } from "../services/paisesServices.mjs"

export async function mostrarInicioController(req, res){
  res.render("index", { title: "Inicio" })
}

// CONTROLADOR: Muestra la lista principal de países
export async function obtenerPaisesEspañolController(req, res) {
  try {
    // 1. Pide los datos a la base de datos
    const paises = await obtenerTodosLosPaisesEspañol()
    // 2. Envía la vista "dashboard" rellena con la lista de países
    res.status(200).render("dashboard", { paises: paises, title: 'Hispanoamérica' })
  }
  catch (error) {
    res.status(500).send({ mensaje: "Operacion fallida", error: error.message })
  }
}

// CONTROLADOR: Elimina un país
export async function eliminarPaisController(req, res) {
  try {
    const id = req.params.id // 1. Obtiene el ID desde la URL
    await eliminarPais(id) // 2. Llama al servicio para borrarlo
    res.redirect("/paises") // 3. Recarga la página principal para ver los cambios
  }
  catch (error) {
    res.status(500).send(`<h1>Error al eliminar</h1><p>${error.message}</p><a href="/paises">Volver</a>`)
  }
}

// CONTROLADOR: Solo muestra el formulario vacío para agregar
export async function mostrarFormularioAgregarController(req, res) {
  res.render("agregarPais", { title: "Agregar pais" })
}

// CONTROLADOR: Procesa los datos del formulario y crea el país
export async function agregarPaisController(req, res) {
  try {
    // req.body contiene los datos que escribió el usuario
    await agregarPais(req.body) // 1. Envía los datos al servicio para guardarlos
    res.redirect('/paises'); // 2. Vuelve al inicio si todo sale bien
  }
  catch (error) {
    res.status(400).json({ message: "Operación fallida", error: error.message })
  }
}

// CONTROLADOR: Busca un país y muestra el formulario para editarlo
export async function mostrarFormularioEditarController(req, res) {
  try {
    const { id } = req.params // Obtiene el ID de la URL
    const pais = await obtenerPais("_id", id) // 1. Busca los datos actuales de ese país
    if (!pais) { // 2. Si no lo encuentra, da error 404
      return res.status(404).send({ mensaje: "Pais no encontrado" })
    }
    // 3. Renderiza el formulario rellenado con los datos del país
    res.render("editarPais", { pais: pais, title: "Editar pais" })
  }
  catch (error) {
    res.status(500).send({ mensaje: "Operacion fallida", error: error.message })
  }
}

// CONTROLADOR: Recibe los cambios y actualiza el país
export async function actualizarPaisController(req, res) {
  try {
    const { id } = req.params;
    const datosParaActualizar = req.body; // Los datos nuevos del formulario
    await actualizarPais(id, datosParaActualizar); // 1. Manda a actualizar en la base de datos
    res.redirect("/paises"); // 2. Vuelve al listado
  }
  catch (error) {
    // Manejo de errores específico
    if (error.message.includes("no existe")) {
        return res.status(404).send(`
            <h1>Error 404: País no encontrado</h1>
            <p>Es probable que otro usuario lo haya eliminado.</p>
            <a href="/paises">Volver al listado</a>
        `);
    }
    // Error genérico del servidor
    res.status(500).send(`
        <h1>Error del Servidor</h1>
        <p>Ocurrió un problema técnico inesperado.</p>
        <p>Detalle: ${error.message}</p>
        <a href="/paises">Volver al listado</a>
    `);
  }
}