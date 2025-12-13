import paisRepository from "../repositories/paisRepository.mjs"
import { renderizarPais, renderizarListaPaises, filtrarEspañol } from "../utils/utilidadesPaises.mjs"

export async function obtenerTodosLosPaisesEspañol() {
  console.log("[Service] obtenerTodos -> Verificando cantidad en DB...")
  const cantidad = await paisRepository.contarDatos()

  if (cantidad == 0) {
    console.log("[Service] obtenerTodos -> DB vacía. Iniciando carga desde API externa...")
    const paisesApi = await paisRepository.obtenerPaisesEndPoint()

    // Log para saber cuántos trajo la API antes de filtrar
    console.log(`[Service] obtenerTodos -> API retornó ${paisesApi.length} países. Filtrando español...`)

    const paisesEspañol = filtrarEspañol(paisesApi)
    const paisesFormateados = renderizarListaPaises(paisesEspañol)

    console.log(`[Service] obtenerTodos -> Guardando ${paisesFormateados.length} países iniciales...`)
    await paisRepository.guardarVarios(paisesFormateados)

    return await paisRepository.obtenerTodos()
  }

  console.log(`[Service] obtenerTodos -> Retornando ${cantidad} países existentes de DB`)
  return await paisRepository.obtenerTodos()
}

export async function eliminarPais(id) {
  console.log(`[Service] eliminarPais -> Buscando y eliminando ID: ${id}`)
  const paisBorrado = await paisRepository.eliminar(id)

  if (!paisBorrado) {
    console.warn("[Service] eliminarPais -> ID no encontrado")
    throw new Error("El pais no se encontro en la base de datos")
  }
  console.log("[Service] eliminarPais -> Eliminación confirmada")
}

export async function agregarPais(pais){
  console.log(`[Service] agregarPais -> Validando existencia de: ${pais.nombreOficial}`)
  if(await paisRepository.obtenerPais("nombreOficial", pais.nombreOficial)){
    console.warn("[Service] agregarPais -> Error: Duplicado detectado")
    throw new Error(`El país ${pais.nombreOficial} ya existe en la base de datos`)
  }

  console.log("[Service] agregarPais -> Validación OK. Enviando a Repo...")
  await paisRepository.agregar(pais)
}

export async function obtenerPais(clave,valor){
  return await paisRepository.obtenerPais(clave,valor)
}

export async function actualizarPais(id,datosActualizados){
  const pais = await paisRepository.obtenerPais("_id",id)
  if(!pais){
    throw new Error("El país que intentas editar no existe.");
  }
  return await paisRepository.actualizar(id, datosActualizados);
}