import mongoose from "mongoose"

// Definimos el "Esquema" (el molde o plano de construcción)
const paisSchema = new mongoose.Schema({
    nombreOficial: {
        type: String,      // Debe ser texto
        required: true,    // Es obligatorio
        minlength: 3,      // Mínimo 3 letras
        maxlength: 90      // Máximo 90 letras
    },

    // Los corchetes [] indican que es una LISTA (Array)
    capital: [{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 90
    }],

    population: {
        type: Number,      // Debe ser número
        required: true,
        min: 1             // No puede haber población 0 o negativa
    },

    area: {
        type: Number,
        required: true,
        min: 1
    },

    borders: [{
        type: String,
        required: false,   // Es opcional (una isla no tiene fronteras)
        minlength: 3,
        maxlength: 3,
        match: /^[A-Z]{3}$/ // Valida que sean exactamente 3 Mayúsculas (Regex)
    }],

    timezones: {
        type: [String],    // Lista de textos
        required: true
    },

    gini: {
        type: Number,
        min: 0,            // Rango lógico del coeficiente Gini (0 a 100)
        max: 100,
        required: false    // Opcional, porque no todos los países tienen este dato
    },

    creadoPor: {
        type: String,
        required: true,
        default: "Gonzalo Santillan" // Si no mandas nada, se rellena solo con esto
    }
}, { collection: "Grupo-20" }); // Fuerza a que la carpeta en Mongo se llame "Grupo-20"

// Creamos el Modelo (la herramienta para interactuar con la DB usando ese molde)
const Pais = mongoose.model('Pais', paisSchema);

export default Pais;