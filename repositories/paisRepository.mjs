import paisEspañol from "../models/pais.mjs"
import IRepository from "./Irepository.mjs"
import axios from "axios"

class paisEspañolRepository extends IRepository {

  // Busca todos los países que tengan como creador ("Gonzalo Santillan")
  async obtenerTodos() {
    return await paisEspañol.find({ creadoPor: "Gonzalo Santillan" })
  }

  // Simplemente cuenta cuántos documentos tienes guardados (útil para verificar si está vacía)
  async contarDatos() {
    return await paisEspañol.countDocuments({ creadoPor: "Gonzalo Santillan" })
  }

  // Sale de tu servidor y busca datos en la API pública de RestCountries
  async obtenerPaisesEndPoint() {
    const response = await axios.get("https://restcountries.com/v3.1/region/america")
    return response.data // Devuelve solo la información útil (el array de países)
  }

  // Guarda una lista masiva de países de una sola vez (ideal para la carga inicial)
  async guardarVarios(listaDePaises) {
    return await paisEspañol.insertMany(listaDePaises);
  }

  // Búsqueda flexible: Puedes buscar por "_id", por "nombreOficial", o lo que quieras
  async obtenerPais(clave, valor){
    const consulta = {}
    consulta[clave] = valor // Crea el filtro dinámicamente (ej: { _id: "123" })
    return await paisEspañol.findOne(consulta)
  }

  // Borra un país usando su ID único
  async eliminar(id){
    return await paisEspañol.findByIdAndDelete(id)
  }

  // Crea un nuevo país individual en la base de datos
  async agregar(pais){
    return await paisEspañol.create(pais)
  }

  // Busca por ID, actualiza los datos y devuelve el país YA modificado ({ new: true })
  async actualizar(id, datosActualizados) {
    return await paisEspañol.findByIdAndUpdate(id, datosActualizados, { new: true });
  }
}

export default new paisEspañolRepository()