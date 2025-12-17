import express from "express"
// Importamos los controladores
import {
  mostrarInicioController,
  obtenerPaisesEspañolController,
  eliminarPaisController,
  mostrarFormularioAgregarController,
  agregarPaisController,
  mostrarFormularioEditarController,
  actualizarPaisController,
  MostrarPaisesEspañolController
} from "../controllers/paisesEspañolController.mjs"

// === CAMBIO AQUÍ: Importamos las nuevas listas separadas ===
import { validarCrear, validarEditar } from "./validationRules.mjs"
import { handleValidatorErrors } from "./errorMiddleware.mjs"

const router = express.Router()

// ==========================================
//  RUTAS GET
// ==========================================
router.get("/", mostrarInicioController)
router.get("/api/paises", obtenerPaisesEspañolController)
router.get("/paises", MostrarPaisesEspañolController)
router.get("/formulario/agregar", mostrarFormularioAgregarController)
router.get("/formulario/editar/:id", mostrarFormularioEditarController)

// ==========================================
//  RUTAS DE ACCIÓN
// ==========================================

router.delete("/paises/:id/eliminar", eliminarPaisController)

// === RUTA CREAR (Usamos validarCrear SIN paréntesis) ===
router.post("/paises/crear",
    validarCrear,                       // 1. Array de validaciones (sin duplicados)
    handleValidatorErrors("agregarPais"), // 2. Si falla, vuelve al form "agregarPais"
    agregarPaisController               // 3. Guarda
)

// === RUTA EDITAR (Usamos validarEditar SIN paréntesis) ===
router.put("/pais/actualizar/:id",
    validarEditar,                      // 1. Array de validaciones (ignora su propio ID)
    handleValidatorErrors("editarPais"),  // 2. Si falla, vuelve al form "editarPais"
    actualizarPaisController            // 3. Actualiza
)

export default router