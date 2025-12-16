// Función que recibe 1 país "crudo" de la API y lo limpia
export function renderizarPais(pais) {
  return {
    // Intenta sacar el nombre en español. Si no existe, usa el nombre común en inglés.
    nombreOficial: pais.translations?.spa?.official || pais.name.common,

    // Si el país no tiene capital (pasa a veces), ponemos un array vacío [] para que no dé error
    capital: pais.capital || [],
    population: pais.population,
    area: pais.area,
    borders: pais.borders || [],
    timezones: pais.timezones || [],

    // Truco: La API devuelve el Gini raro (ej: { "2019": 41.5 }).
    // Con Object.values sacamos solo el valor (41.5) y descartamos el año.
    gini: pais.gini ? Object.values(pais.gini)[0] : null,

    creadoPor: "Gonzalo Santillan" // Tu firma automática en todos los países
  }
}

// Función que recibe MUCHOS países y los limpia uno por uno
export function renderizarListaPaises(paises) {
  // .map() recorre la lista y le aplica la limpieza a cada elemento
  return paises.map(pais => renderizarPais(pais));
}

// Función que actúa como colador
export function filtrarEspañol(paises) {
    return paises.filter(pais => {
        // Solo deja pasar al país si tiene lista de idiomas Y si 'spa' está incluido
        return pais.languages && pais.languages.hasOwnProperty('spa')
    })
}