import paisEspañol from "../models/pais.mjs"
import IRepository from "./Irepository.mjs"
import axios from "axios"

class paisEspañolRepository extends IRepository {
  async obtenerTodos() {
    return await paisEspañol.find({ creadoPor: "Gonzalo Santillan" })
  }

  async contarDatos() {
    return await paisEspañol.countDocuments({ creadoPor: "Gonzalo Santillan" })
  }

  async obtenerPaisesEndPoint() {
    console.log("\nCapa: Repositories - Funcion: obtenerPaisesEndPoint")
    console.log("Importando datos de https://restcountries.com/v3.1/region/america")
    const response = await axios.get("https://restcountries.com/v3.1/region/america")
    return response.data
  }

  async guardarVarios(listaDePaises) {
    return await paisEspañol.insertMany(listaDePaises);
  }

  async obtenerPais(clave,valor){
    const consulta = {}
    consulta[clave] = valor
    return await paisEspañol.findOne(consulta)
  }

  async eliminar(id){
    return await paisEspañol.findByIdAndDelete(id)
  }
}

export default new paisEspañolRepository()


