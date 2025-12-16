import express from "express"
// Importamos los controladores (las funciones que tienen la lógica)
import {
  mostrarInicioController,
  obtenerPaisesEspañolController,
  eliminarPaisController,
  mostrarFormularioAgregarController,
  agregarPaisController,
  mostrarFormularioEditarController,
  actualizarPaisController
} from "../controllers/paisesEspañolController.mjs"

// Importamos las reglas de validación y el árbitro de errores
import { registerValidationRules } from "./validationRules.mjs"
import { handleValidatorErrors } from "./errorMiddleware.mjs"

const router = express.Router()

// ==========================================
//  RUTAS GET (Para mostrar páginas y datos)
// ==========================================

// Página de Inicio (Home)
router.get("/", mostrarInicioController)

// Muestra el Dashboard con la tabla de todos los países
router.get("/paises", obtenerPaisesEspañolController)

// Muestra el formulario VACÍO para crear un país nuevo
router.get("/formulario/agregar", mostrarFormularioAgregarController)

// Muestra el formulario RELLENO con los datos del país a editar (busca por ID)
router.get("/formulario/editar/:id", mostrarFormularioEditarController)


// ==========================================
//  RUTAS DE ACCIÓN (POST, PUT, DELETE)
// ==========================================

// Eliminar un país específico
router.delete("/paises/:id/eliminar", eliminarPaisController)

// Crear un país nuevo (Pasa por 3 pasos)
router.post("/paises/crear",
    registerValidationRules(),         // 1. Chequea las reglas (validator)
    handleValidatorErrors("agregarPais"), // 2. Si hay error, te devuelve al form "agregarPais"
    agregarPaisController                 // 3. Si pasa, el controlador guarda el país
)

// Actualizar un país existente (Pasa por los mismos 3 pasos)
router.put("/pais/actualizar/:id",
    registerValidationRules(),        // 1. Chequea las reglas
    handleValidatorErrors("editarPais"), // 2. Si hay error, te devuelve al form "editarPais"
    actualizarPaisController             // 3. Si pasa, el controlador guarda los cambios
)

export default router