import { body } from "express-validator"

export const registerValidationRules = () => [
  body("nombreOficial")
    .trim()
    .notEmpty().withMessage("El nombre del pais es requerido")
    .isLength({ min: 3, max: 90 }).withMessage("El nombre debe tener entre 3 y 90 caracteres"),

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
    .notEmpty().withMessage("La poblacion es requerida")
    .isInt({ min: 1 }).withMessage("La poblacion debe ser un numero mayor a 1"),

  body("area")
    .trim()
    .notEmpty().withMessage("El area es requerida")
    .isInt({ min: 1 }).withMessage("La el area debe ser un numero mayor a 1"),

  body("borders")
    .customSanitizer((borders) => {
      if (!Array.isArray(borders)) return [];
      return borders.filter(b => b !== null && b.trim() !== "");
    })
    .custom((borders) => {
      const molde = /^[A-Z]{3}$/;
      borders.forEach((pais, index) => {
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
    .notEmpty().withMessage("La poblacion es requerida")
    .isFloat({ min: 0, max: 100 }).withMessage("El gini debe estar entre 0 y 100")
]