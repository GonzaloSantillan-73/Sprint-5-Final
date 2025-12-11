import paisRepository from "../repositories/paisRepository.mjs"
import { renderizarPais, renderizarListaPaises, filtrarEspañol } from "../utils/utilidadesPaises.mjs"

export async function obtenerTodosLosPaisesEspañol() {
  console.log("Capa: Services - Funcion: obtenerTodosLosPaisesEspañol")
  console.log("Contando paises...")
  const cantidad = await paisRepository.contarDatos()

  if (cantidad == 0) {
    console.log("Cantidad: 0")
    console.log("Base de datos vacia...")
    const paisesApi = await paisRepository.obtenerPaisesEndPoint()
    const paisesEspañol = filtrarEspañol(paisesApi)
    const paisesFormateados = renderizarListaPaises(paisesEspañol)
    await paisRepository.guardarVarios(paisesFormateados)
    return await paisRepository.obtenerTodos()
  }
  console.log("Cantidad: ", cantidad)
  console.log("Obteniendo paises...")
  return await paisRepository.obtenerTodos()
}

export async function eliminarPais(id) {
  const paisBorrado = await paisRepository.eliminar(id)
  if (!paisBorrado) {
    throw new Error("El pais no se encontro en la base de datos")
  }
}