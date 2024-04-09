var mongoose = require("mongoose")

var pessoaSchema = new mongoose.Schema({
    BI : {
        type: String,
        required: true
    }, 
    nome : String,
    idade : Number,
    sexo: String,
    descrição: String,
    profissão: String,
    religião: String,
}, { versionKey : false })

module.exports = mongoose.model('pessoas', pessoaSchema)