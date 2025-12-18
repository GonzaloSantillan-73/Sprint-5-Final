import { validationResult } from "express-validator";

// Esta función actúa como un intermediario (Middleware).
// Recibe el nombre de la vista (ej: "agregarPais") para saber qué formulario volver a mostrar si algo sale mal.
export const handleValidatorErrors = (nombreDeLaVista) => {
  return (req, res, next) => {

    // Le pregunto a express-validator si encontró errores en la petición
    const reporteDeValidacion = validationResult(req);

    // Si la lista de errores está vacía, significa que todo salió bien
    // Así que dejo pasar la petición al siguiente paso (el controlador)
    if (reporteDeValidacion.isEmpty()) {
      return next();
    }

    // Si llegó acá es porque hay errores. Obtengo el array con los detalles.
    const listaCruda = reporteDeValidacion.array();

    // Convierto ese array complicado en un objeto simple para que sea más fácil de usar en el EJS.
    // Quedaría algo así: { nombreOficial: "Error en el nombre", area: "Debe ser numero" }
    const diccionarioDeErrores = listaCruda.reduce((libretaDeErrores, errorActual) => {
      const campoCulpa = errorActual.path; // El campo que falló (ej: "population")
      const mensaje = errorActual.msg;     // El mensaje de error
      libretaDeErrores[campoCulpa] = mensaje;
      return libretaDeErrores;
    }, {});

    // Guardo los datos que escribió el usuario para volver a mostrarlos en el formulario.
    // Así no tiene que escribir todo de nuevo desde cero.
    const datosDelUsuario = req.body;

    // Si estamos editando, me aseguro de no perder el ID del país
    if (req.params.id) {
      datosDelUsuario._id = req.params.id;
    }

    // Vuelvo a renderizar la vista del formulario, pero enviando los errores y los datos previos
    res.status(400).render(nombreDeLaVista, {
      title: "Corregir errores",
      pais: datosDelUsuario,
      errores: diccionarioDeErrores
    });
  };
};