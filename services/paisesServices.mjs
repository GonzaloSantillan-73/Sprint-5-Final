import paisRepository from "../repositories/paisRepository.mjs"
import {renderizarPais,renderizarListaPaises,filtrarEspañol} from "../utils/utilidadesPaises.mjs"

export async function obtenerTodosLosPaisesEspañol() {
  console.log("Capa: Services - Funcion: obtenerTodosLosPaisesEspañol")
  console.log("Contando paises...")
  const cantidad = await paisRepository.contarDatos()

  if (cantidad == 0) {
    console.log("Cantidad: 0")
    console.log("Base de datos vacia...")
    console.log("Importando datos de https://restcountries.com/v3.1/region/america")

    const paisesApi = await paisRepository.obtenerPaisesEndPoint()
    const paisesEspañol = filtrarEspañol(paisesApi)
    const paisesFormateados = renderizarListaPaises(paisesEspañol)
    await paisRepository.guardarVarios(paisesFormateados)
    return paisesFormateados
  }
  console.log("Cantidad: ",cantidad)
  console.log("Obteniendo paises...")
  return await paisRepository.obtenerTodos()
}