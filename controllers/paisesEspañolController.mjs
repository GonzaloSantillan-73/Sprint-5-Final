import { obtenerTodosLosPaisesEspañol, eliminarPais, agregarPais, obtenerPais, actualizarPais } from "../services/paisesServices.mjs"

export async function obtenerPaisesEspañolController(req, res) {
  try {
    console.log("\n[Controller] obtenerPaisesEspañol -> Solicitando lista al servicio...")
    const paises = await obtenerTodosLosPaisesEspañol()
    console.log(`[Controller] obtenerPaisesEspañol -> Renderizando dashboard con ${paises.length} países`)
    res.status(200).render("dashboard", { paises: paises, title: 'Hispanoamérica' })
  }
  catch (error) {
    console.error("[Controller] Error en obtenerPaises:", error.message)
    res.status(500).send({ mensaje: "Operacion fallida", error: error.message })
  }
}

export async function eliminarPaisController(req, res) {
  try {
    const id = req.params.id
    console.log(`\n[Controller] eliminarPais -> Solicitud para eliminar ID: ${id}`)
    await eliminarPais(id)
    console.log("[Controller] eliminarPais -> Eliminación exitosa, redirigiendo...")
    res.redirect("/paises")
  }
  catch (error) {
    console.error("[Controller] Error en eliminarPais:", error.message)
    res.status(500).send(`<h1>Error al eliminar</h1><p>${error.message}</p><a href="/paises">Volver</a>`)
  }
}

export async function mostrarFormularioAgregarController(req, res) {
  console.log("\n[Controller] mostrarFormulario -> Renderizando vista de formulario")
  res.render("agregarPais", { title: "Agregar pais" })
}

export async function agregarPaisController(req, res) {
  try {
    // Muestra el nombre para saber qué país intenta cargar
    console.log(`\n[Controller] agregarPais -> Procesando datos para: ${req.body.nombreOficial}`)
    await agregarPais(req.body)
    console.log("[Controller] agregarPais -> País creado, redirigiendo...")
    res.redirect('/paises');
  }
  catch (error) {
    console.error("[Controller] Error en agregarPais:", error.message)
    res.status(400).json({ message: "Operación fallida", error: error.message })
  }
}

export async function mostrarFormularioEditarController(req, res) {
  try {
    const { id } = req.params
    const pais = await obtenerPais("_id", id)
    if (!pais) {
      return res.status(404).send({ mensaje: "Pais no encontrado" })
    }
    res.render("editarPais", { pais: pais, title: "Editar pais" })
  }
  catch (error) {

  }
}

export async function actualizarPaisController(req, res) {
  try {
    const { id } = req.params;
    const datosParaActualizar = req.body;
    await actualizarPais(id,datosParaActualizar);
    console.log("[Controller] Actualización exitosa.");
    res.redirect("/paises");
  }
  catch (error) {
    console.error("[Controller] Fallo crítico:", error.message);
    if (error.message.includes("no existe")) {
        return res.status(404).send(`
            <h1>Error 404: País no encontrado</h1>
            <p>Es probable que otro usuario lo haya eliminado.</p>
            <a href="/paises">Volver al listado</a>
        `);
    }
    res.status(500).send(`
        <h1>Error del Servidor</h1>
        <p>Ocurrió un problema técnico inesperado.</p>
        <p>Detalle: ${error.message}</p>
        <a href="/paises">Volver al listado</a>
    `);
  }
}