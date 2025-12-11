export function renderizarPais(pais) {
  return {
    nombreOficial: pais.translations?.spa?.official || pais.name.common,
    capital: pais.capital || [],
    population: pais.population,
    area: pais.area,
    borders: pais.borders || [],
    timezones: pais.timezones || [],
    gini: pais.gini ? Object.values(pais.gini)[0] : null,
    creador: "Gonzalo Santillan"
  }
}

export function renderizarListaPaises(paises) {
  return paises.map(pais => renderizarPais(pais));
}

export function filtrarEspañol(paises) {
    return paises.filter(pais => {
        return pais.languages && pais.languages.hasOwnProperty('spa')
    })
}