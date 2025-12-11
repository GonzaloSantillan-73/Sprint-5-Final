import express from "express"
import {
  obtenerPaisesEspañolController,
  eliminarPaisController
} from "../controllers/paisesEspañolController.mjs"


const router = express.Router()

router.get("/", (req, res) => {
  res.render("index", { title: "Inicio" })
})
router.get("/paises", obtenerPaisesEspañolController)

router.delete("/paises/:id/eliminar", eliminarPaisController)

export default router