import { validationResult } from "express-validator";

// Esta función recibe el nombre de la vista (ej: "agregarPais") para saber a dónde volver si hay error
export const handleValidatorErrors = (nombreDeLaVista) => {
  return (req, res, next) => {

    // 1. Pregunta a express-validator: "¿Hubo algún error en las reglas que definimos?"
    const reporteDeValidacion = validationResult(req);

    // 2. Si la lista de errores está vacía, todo perfecto: Pase al siguiente (al Controlador)
    if (reporteDeValidacion.isEmpty()) {
      return next();
    }

    // --- SI LLEGAMOS AQUÍ, ES QUE HUBO ERRORES ---

    const listaCruda = reporteDeValidacion.array();

    // 3. Transformamos la lista fea de errores en un "Diccionario" fácil de leer
    // Convierte esto: [{ path: 'nombre', msg: 'Error' }]
    // En esto: { nombre: 'Error' }
    const diccionarioDeErrores = listaCruda.reduce((libretaDeErrores, errorActual) => {
      const campoCulpa = errorActual.path; // ¿Qué input falló?
      const mensaje = errorActual.msg;     // ¿Qué mensaje le toca?
      libretaDeErrores[campoCulpa] = mensaje;
      return libretaDeErrores;
    }, {});

    // 4. Detiene el proceso y vuelve a mostrar el formulario (render)
    // Importante: Le devolvemos 'req.body' (pais) para que el usuario no tenga que escribir todo de nuevo
    res.status(400).render(nombreDeLaVista, {
      title: "Corregir errores",
      pais: req.body,            // Los datos que el usuario ya escribió
      errores: diccionarioDeErrores // Los mensajes en rojo
    });
  };
};