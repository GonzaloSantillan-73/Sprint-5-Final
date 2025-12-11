import paisEspañol from "../models/pais.mjs"
import IRepository from "./Irepository.mjs"

class paisEspañolRepository extends IRepository {
  async obtenerTodos() {
    return await paisEspañol.find({ creador: "Gonzalo Santillan" })
  }
  async contarDatos() {
    return await paisEspañol.countDocuments({ creador: "Gonzalo Santillan" })
  }
  async obtenerPaisesEndPoint() {
    const response = await fetch("https://restcountries.com/v3.1/region/america")
    return await response.json()
  }
  async guardarVarios(listaDePaises) {
    return await paisEspañol.insertMany(listaDePaises);
  }
}

export default new paisEspañolRepository()


