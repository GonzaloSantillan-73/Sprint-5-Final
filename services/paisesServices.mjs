import paisRepository from "../repositories/paisRepository.mjs"
import { renderizarPais, renderizarListaPaises, filtrarEspañol } from "../utils/utilidadesPaises.mjs"

export async function obtenerTodosLosPaisesEspañol() {
  // 1. Preguntamos al repositorio cuántos datos tenemos
  const cantidad = await paisRepository.contarDatos()

  // 2. Lógica de "Carga Inicial" (Seed):
  // Si la base de datos está vacía, tenemos que ir a buscar los datos a la API externa
  if (cantidad == 0) {
    const paisesApi = await paisRepository.obtenerPaisesEndPoint()

    // Filtramos para quedarnos solo con los de habla hispana y formateamos los datos
    const paisesEspañol = filtrarEspañol(paisesApi)
    const paisesFormateados = renderizarListaPaises(paisesEspañol)

    // Guardamos todo en MongoDB para no tener que consultar la API externa nunca más
    await paisRepository.guardarVarios(paisesFormateados)

    return await paisRepository.obtenerTodos()
  }

  // 3. Si ya tenemos datos, simplemente los devolvemos desde nuestra base de datos local
  return await paisRepository.obtenerTodos()
}

export async function eliminarPais(id) {
  // Mandamos a borrar el documento
  const paisBorrado = await paisRepository.eliminar(id)

  // Si el repositorio devuelve null, significa que ese ID no existía
  if (!paisBorrado) {
    throw new Error("El pais no se encontro en la base de datos")
  }
}

export async function agregarPais(pais){
  // Validamos que no exista otro país con el mismo nombre
  if(await paisRepository.obtenerPais("nombreOficial", pais.nombreOficial)){
    throw new Error(`El país ${pais.nombreOficial} ya existe en la base de datos`)
  }

  // Si es único, procedemos a guardarlo
  await paisRepository.agregar(pais)
}

export async function obtenerPais(clave,valor){
  // Función puente para buscar un país específico (por ID, nombre, etc.)
  return await paisRepository.obtenerPais(clave,valor)
}

export async function actualizarPais(id,datosActualizados){
  // Paso de seguridad: Verificamos que el país exista antes de intentar editarlo
  const pais = await paisRepository.obtenerPais("_id",id)

  if(!pais){
    throw new Error("El país que intentas editar no existe.");
  }

  // Si existe, enviamos los nuevos datos al repositorio
  return await paisRepository.actualizar(id, datosActualizados);
}