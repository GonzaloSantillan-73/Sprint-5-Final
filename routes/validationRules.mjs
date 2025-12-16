import { body } from "express-validator"

export const registerValidationRules = () => [

  // === 1. VALIDACIÓN DEL NOMBRE ===
  body("nombreOficial")
    .trim() // Quita los espacios sobrantes al inicio y final
    .notEmpty().withMessage("El nombre del pais es requerido")
    .isLength({ min: 3, max: 90 }).withMessage("El nombre debe tener entre 3 y 90 caracteres"),

  // === 2. VALIDACIÓN DE CAPITALES (Es una lista) ===
  body("capital")
    // Sanitizer: Limpieza previa. Si vienen campos vacíos en la lista, los elimina.
    .customSanitizer((capitales) => {
      if (!Array.isArray(capitales)) return []; // Si no es lista, devuelve lista vacía
      return capitales.filter(c => c !== null && c.trim() !== ""); // Filtra los vacíos
    })
    // Regla 1: Debe haber al menos una capital válida
    .isArray({ min: 1 }).withMessage("Debe ingresar al menos una capital")
    // Regla 2 (Custom): Revisa que cada texto de capital tenga el largo correcto
    .custom((capitales) => {
      capitales.forEach((cap) => {
        if (cap.trim().length < 3 || cap.trim().length > 90) {
          throw new Error(`La capital "${cap}" debe tener entre 3 y 90 caracteres`);
        }
      });
      return true;
    }),

  // === 3. VALIDACIÓN DE POBLACIÓN ===
  body("population")
    .trim()
    .notEmpty().withMessage("La poblacion es requerida")
    .isInt({ min: 1 }).withMessage("La poblacion debe ser un numero mayor a 1"),

  // === 4. VALIDACIÓN DE ÁREA ===
  body("area")
    .trim()
    .notEmpty().withMessage("El area es requerida")
    .isInt({ min: 1 }).withMessage("El area debe ser un numero mayor a 1"),

  // === 5. VALIDACIÓN DE FRONTERAS (Códigos de 3 letras) ===
  body("borders")
    // Sanitizer: Elimina los inputs que el usuario dejó vacíos
    .customSanitizer((borders) => {
      if (!Array.isArray(borders)) return [];
      return borders.filter(b => b !== null && b.trim() !== "");
    })
    // Custom: Verifica que cumplan la Regex de 3 Mayúsculas (Ej: ARG)
    .custom((borders) => {
      const molde = /^[A-Z]{3}$/;
      borders.forEach((pais) => {
        if (!molde.test(pais)) {
          throw new Error(`La frontera "${pais}" debe ser 3 mayúsculas (Ej: ARG)`);
        }
      });
      return true;
    }),

  // === 6. VALIDACIÓN DE ZONAS HORARIAS ===
  body("timezones")
    .customSanitizer((timezones) => {
      if (!Array.isArray(timezones)) return [];
      return timezones.filter(tz => typeof tz === 'string' && tz.trim() !== "");
    })
    .isArray({ min: 1 }).withMessage("Debe incluir al menos una zona horaria"),

  // === 7. VALIDACIÓN DE GINI (Coeficiente de desigualdad) ===
  body("gini")
    .trim()
    .notEmpty().withMessage("El índice Gini es requerido")
    .isFloat({ min: 0, max: 100 }).withMessage("El gini debe estar entre 0 y 100")
]