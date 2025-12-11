import mongoose from "mongoose"

const paisSchema = new mongoose.Schema({
    nombreOficial: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 90
    },

    capital: [{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 90
    }],

    population: {
        type: Number,
        required: true,
        min: 0
    },

    area: {
        type: Number,
        required: true,
        min: 0
    },

    borders: [{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 3,
        match: /^[A-Z]{3}$/
    }],

    timezones: {
        type: [String],
        required: true
    },

    gini: {
        type: Number,
        min: 0,
        max: 100,
        required: false
    },

    creadoPor: {
        type: String,
        required: true,
        default: "Gonzalo Santillan"
    }
}, { collection: "Grupo-20" });

const Pais = mongoose.model('Pais', paisSchema);

export default Pais;