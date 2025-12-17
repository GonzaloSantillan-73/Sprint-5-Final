import { body } from "express-validator";
import Pais from "../models/pais.mjs";

const reglasComunes = [
  body("capital")
    .customSanitizer((capitales) => {
      if (!Array.isArray(capitales)) return [];
      return capitales.filter(c => c !== null && c.trim() !== "");
    })
    .isArray({ min: 1 }).withMessage("Debe ingresar al menos una capital")
    .custom((capitales) => {
      capitales.forEach((cap) => {
        if (cap.trim().length < 3 || cap.trim().length > 90) {
          throw new Error(`La capital "${cap}" debe tener entre 3 y 90 caracteres`);
        }
      });
      return true;
    }),

  body("population")
    .trim()
    .notEmpty().withMessage("La población es requerida")
    .isInt({ min: 1 }).withMessage("La población debe ser mayor a 1"),

  body("area")
    .trim()
    .notEmpty().withMessage("El área es requerida")
    .isInt({ min: 1 }).withMessage("El área debe ser mayor a 1"),

  body("borders")
    .customSanitizer((borders) => {
      if (!Array.isArray(borders)) return [];
      return borders.filter(b => b !== null && b.trim() !== "");
    })
    .custom((borders) => {
      const molde = /^[A-Z]{3}$/;
      borders.forEach((pais) => {
        if (!molde.test(pais)) {
          throw new Error(`La frontera "${pais}" debe ser 3 mayúsculas (Ej: ARG)`);
        }
      });
      return true;
    }),

  body("timezones")
    .customSanitizer((timezones) => {
      if (!Array.isArray(timezones)) return [];
      return timezones.filter(tz => typeof tz === 'string' && tz.trim() !== "");
    })
    .isArray({ min: 1 }).withMessage("Debe incluir al menos una zona horaria"),

  body("gini")
    .trim()
    .notEmpty().withMessage("El índice Gini es requerido")
    .isFloat({ min: 0, max: 100 }).withMessage("El gini debe estar entre 0 y 100")
];

export const validarCrear = [
  ...reglasComunes,

  body("nombreOficial")
    .trim()
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 3, max: 90 }).withMessage("El nombre debe tener entre 3 y 90 caracteres")
    .custom(async (value) => {
      const todosLosPaises = await Pais.find();

      const duplicado = todosLosPaises.find(pais => {
        if (!pais.nombreOficial) return false;
        return pais.nombreOficial.toLowerCase() === value.toLowerCase();
      });

      if (duplicado) {
        throw new Error("El país ya existe en la base de datos");
      }
      return true;
    })
];

export const validarEditar = [
  ...reglasComunes,

  body("nombreOficial")
    .trim()
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 3, max: 90 }).withMessage("El nombre debe tener entre 3 y 90 caracteres")
    .custom(async (value, { req }) => {
      const idActual = req.params.id;
      const todosLosPaises = await Pais.find();

      const paisEncontrado = todosLosPaises.find(pais => {
        if (!pais.nombreOficial) return false;
        return pais.nombreOficial.toLowerCase() === value.toLowerCase();
      });

      if (paisEncontrado) {
        if (paisEncontrado._id.toString() !== idActual) {
          throw new Error("El nombre ya está siendo usado por otro país");
        }
      }
      return true;
    })
];