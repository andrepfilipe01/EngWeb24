var mongoose = require("mongoose")

var pessoaSchema = new mongoose.Schema({
    BI : String,
    nome : String,
    idade : Number,
    sexo: String,
    descrição: String,
    profissão: String,
    religião: String,
}, { versionKey : false })

module.exports = mongoose.model('pessoas', pessoaSchema)