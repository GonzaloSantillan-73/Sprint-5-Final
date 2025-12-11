import { obtenerTodosLosPaisesEspañol } from "../services/paisesServices.mjs"

export async function obtenerPaisesEspañolController(req, res) {
  try {
    console.log("\nCapa: Controller - Funcion: obtenerPaisesEspañolController")
    const paises = await obtenerTodosLosPaisesEspañol()
    res.status(200).render("dashboard", { paises: paises, title: 'Hispanoamérica' })
  }
  catch (error) {
    res.status(500).send({ mensaje: "Operacion fallida", error: error.message })
  }
}