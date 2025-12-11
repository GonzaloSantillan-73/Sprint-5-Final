import { obtenerTodosLosPaisesEspañol,eliminarPais} from "../services/paisesServices.mjs"

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

export async function eliminarPaisController(req,res){
  try{
    const id = req.params.id
    await eliminarPais(id)
    res.redirect("/paises")
  }
  catch(error){
    console.error(error)
    res.status(500).send(`<h1>Error al eliminar</h1><p>${error.message}</p><a href="/paises">Volver</a>`)
  }
}