import paisEspañol from "../models/pais.mjs"
import IRepository from "./Irepository.mjs"
import axios from "axios"

class paisEspañolRepository extends IRepository {
  async obtenerTodos() {
    // console.log("[Repo] obtenerTodos -> Ejecutando .find()") // Opcional, puede ser mucho ruido
    return await paisEspañol.find({ creadoPor: "Gonzalo Santillan" })
  }

  async contarDatos() {
    const cuenta = await paisEspañol.countDocuments({ creadoPor: "Gonzalo Santillan" })
    console.log(`[Repo] contarDatos -> Total: ${cuenta}`)
    return cuenta
  }

  async obtenerPaisesEndPoint() {
    console.log("[Repo] obtenerPaisesEndPoint -> Fetching data from RestCountries API...")
    const response = await axios.get("https://restcountries.com/v3.1/region/america")
    console.log("[Repo] obtenerPaisesEndPoint -> Datos recibidos de API externa")
    return response.data
  }

  async guardarVarios(listaDePaises) {
    console.log(`[Repo] guardarVarios -> Insertando ${listaDePaises.length} documentos...`)
    return await paisEspañol.insertMany(listaDePaises);
  }

  async obtenerPais(clave, valor){
    console.log(`[Repo] obtenerPais -> Buscando One donde { ${clave}: "${valor}" }`)
    const consulta = {}
    consulta[clave] = valor
    return await paisEspañol.findOne(consulta)
  }

  async eliminar(id){
    console.log(`[Repo] eliminar -> Ejecutando findByIdAndDelete(${id})`)
    return await paisEspañol.findByIdAndDelete(id)
  }

  async agregar(pais){
    console.log("[Repo] agregar -> Creando nuevo documento en MongoDB")
    return await paisEspañol.create(pais)
  }

async actualizar(id, datosActualizados) {
    console.log(`[Repo] actualizar -> Modificando ID: ${id}`);
    return await paisEspañol.findByIdAndUpdate(id, datosActualizados, { new: true });
  }
}

export default new paisEspañolRepository()