import { body } from "express-validator";
import Pais from "../models/pais.mjs";

// Creamos un paquete de reglas que se usan IGUAL tanto para crear como para editar.
// Así no escribimos el mismo código dos veces (DRY).
const reglasComunes = [
  body("capital")
    // Primero "limpiamos" la lista: si llegan espacios vacíos o nulos, los sacamos.
    .customSanitizer((capitales) => {
      if (!Array.isArray(capitales)) return []
      return capitales.filter(c => c !== null && c.trim() !== "")
    })
    // Verificamos que sea una lista y tenga al menos una capital
    .isArray({ min: 1 }).withMessage("Debe ingresar al menos una capital")
    // Revisamos cada capital una por una para ver si la longitud es correcta
    .custom((capitales) => {
      capitales.forEach((cap) => {
        if (cap.trim().length < 3 || cap.trim().length > 90) {
          throw new Error(`La capital "${cap}" debe tener entre 3 y 90 caracteres`)
        }
      });
      return true;
    }),

  body("population")
    .trim() // Quita espacios al principio y final
    .notEmpty().withMessage("La población es requerida")
    .isInt({ min: 1 }).withMessage("La población debe ser mayor a 1"), // Tiene que ser entero positivo

  body("area")
    .trim()
    .notEmpty().withMessage("El área es requerida")
    .isInt({ min: 1 }).withMessage("El área debe ser mayor a 1"),

  body("borders")
    // Limpieza de datos vacíos igual que en capitales
    .customSanitizer((borders) => {
      if (!Array.isArray(borders)) return []
      return borders.filter(b => b !== null && b.trim() !== "")
    })
    .custom((borders) => {
      // Usamos una Expresión Regular (Regex) como "molde".
      // Significa: Exactamente 3 letras de la A a la Z mayúsculas.
      const molde = /^[A-Z]{3}$/
      borders.forEach((pais) => {
        if (!molde.test(pais)) {
          throw new Error(`La frontera "${pais}" debe ser 3 mayúsculas (Ej: ARG)`);
        }
      });
      return true;
    }),

  body("timezones")
    .customSanitizer((timezones) => {
      if (!Array.isArray(timezones)) return []
      return timezones.filter(tz => typeof tz === 'string' && tz.trim() !== "")
    })
    .isArray({ min: 1 }).withMessage("Debe incluir al menos una zona horaria"),

  body("gini")
    .trim()
    .notEmpty().withMessage("El índice Gini es requerido")
    // Acá usamos isFloat porque el Gini puede ser decimal (ej: 41.5)
    .isFloat({ min: 0, max: 100 }).withMessage("El gini debe estar entre 0 y 100")
];

// Reglas específicas para cuando CREAMOS un país nuevo
export const validarCrear = [
  reglasComunes, // Traemos todas las reglas de arriba

  body("nombreOficial")
    .trim()
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 3, max: 90 }).withMessage("El nombre debe tener entre 3 y 90 caracteres")
    // Validación personalizada asíncrona (consulta la Base de Datos)
    .custom(async (value) => {
      const todosLosPaises = await Pais.find()

      // Buscamos si ya existe alguien con ese nombre (sin importar mayúsculas/minúsculas)
      const duplicado = todosLosPaises.find(pais => {
        if (!pais.nombreOficial) return false
        return pais.nombreOficial.toLowerCase() === value.toLowerCase()
      });

      if (duplicado) {
        throw new Error("El país ya existe en la base de datos")
      }
      return true
    })
];

// Reglas específicas para cuando EDITAMOS un país
export const validarEditar = [
  reglasComunes,

  body("nombreOficial")
    .trim()
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 3, max: 90 }).withMessage("El nombre debe tener entre 3 y 90 caracteres")
    .custom(async (value, { req }) => {
      const idActual = req.params.id // El ID del país que estoy editando ahora
      const todosLosPaises = await Pais.find()

      // Buscamos si el nombre ya existe en la base de datos
      const paisEncontrado = todosLosPaises.find(pais => {
        if (!pais.nombreOficial) return false
        return pais.nombreOficial.toLowerCase() === value.toLowerCase()
      });

      // Si encontramos un país con ese nombre...
      if (paisEncontrado) {
        // ...verificamos que NO sea el mismo que estoy editando.
        // Si el ID es diferente, significa que le estoy robando el nombre a otro país.
        if (paisEncontrado._id.toString() !== idActual) {
          throw new Error("El nombre ya está siendo usado por otro país")
        }
      }
      return true;
    })
];