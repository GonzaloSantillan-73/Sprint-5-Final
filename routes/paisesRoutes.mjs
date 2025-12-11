import express from "express"
import {obtenerPaisesEspañolController} from "../controllers/paisesEspañolController.mjs"


const router = express.Router()

router.get("/", (req, res) => {
  res.render("index",{title:"Inicio"})
})
router.get("/paises",obtenerPaisesEspañolController)

export default router