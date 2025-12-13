import express from "express"
import {
  obtenerPaisesEspañolController,
  eliminarPaisController,
  mostrarFormularioAgregarController,
  agregarPaisController,
  mostrarFormularioEditarController,
  actualizarPaisController
} from "../controllers/paisesEspañolController.mjs"
import { registerValidationRules } from "./validationRules.mjs"
import { handleValidatorErrors } from "./errorMiddleware.mjs"

const router = express.Router()

router.get("/", (req, res) => {
  res.render("index", { title: "Inicio" })
})
router.get("/paises", obtenerPaisesEspañolController)

router.get("/formulario/agregar", mostrarFormularioAgregarController)

router.get("/formulario/editar/:id", mostrarFormularioEditarController)

router.delete("/paises/:id/eliminar", eliminarPaisController)

router.post("/paises/crear",
    ...registerValidationRules(),
    handleValidatorErrors("agregarPais"),
    agregarPaisController
)

router.put("/pais/actualizar/:id",
    ...registerValidationRules(),
    handleValidatorErrors("editarPais"),
    actualizarPaisController
)

export default router