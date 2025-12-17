import { validationResult } from "express-validator";

export const handleValidatorErrors = (nombreDeLaVista) => {
  return (req, res, next) => {
    const reporteDeValidacion = validationResult(req);

    if (reporteDeValidacion.isEmpty()) {
      return next();
    }
    const listaCruda = reporteDeValidacion.array();
    const diccionarioDeErrores = listaCruda.reduce((libretaDeErrores, errorActual) => {
      const campoCulpa = errorActual.path;
      const mensaje = errorActual.msg;
      libretaDeErrores[campoCulpa] = mensaje;
      return libretaDeErrores;
    }, {});

    const datosDelUsuario = req.body;
    if (req.params.id) {
      datosDelUsuario._id = req.params.id;
    }
    res.status(400).render(nombreDeLaVista, {
      title: "Corregir errores",
      pais: datosDelUsuario,
      errores: diccionarioDeErrores
    });
  };
};
