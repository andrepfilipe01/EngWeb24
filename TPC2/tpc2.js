var http = require('http');
var url = require('url');
var axios = require('axios');

http.createServer((req, res) => {

    var q = url.parse(req.url, true);
    const path = q.pathname;

    if (path == "/alunos") {
        axios.get("http://localhost:3000/alunos?_sort=nome")
            .then((resp) => {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write('<h1>Índice de Alunos</h1>');
                var data = resp.data;
                var alunosList = "<ul>";
                for (i in data) {
                    alunosList += "<li><a href='/alunos/" + data[i].id + "'>" + data[i].nome + "</a></li>";
                }
                alunosList += "</ul>";
                res.end(alunosList);
            })
            .catch((erro) => {
                console.log("Erro: " + erro);
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end("<p>" + erro + "</p>");
            });
    } else if (path.startsWith('/alunos')) {

        let id = req.url.substring(8);
        axios.get("http://localhost:3000/alunos/" + id)
            .then((resp) => {
                var data = resp.data;
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write(`<h1>${data.nome}</h1>`);
                res.write(`<p><b>Data de Nascimento:</b> ${data.dataNasc}</p>`);
                res.write(`<p><b>Curso:</b> <a href="/cursos/${data.curso}">${data.curso}</a></p>`);
                res.write(`<p><b>Ano do Curso:</b> ${data.anoCurso}</p>`);
                res.write(`<p><b>Instrumento:</b> ${data.instrumento}</p>`);
                res.write('<a href="/alunos">Voltar</a>');
                res.end();
            })
            .catch((erro) => {
                console.log("Erro: " + erro);
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end("<p>" + erro + "</p>");
            });
    } else if (path.startsWith('/cursos')) {
        
        let cursoId = req.url.substring(8);
        axios.get("http://localhost:3000/cursos/" + cursoId)
            .then((resp) => {
                var data = resp.data;
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write(`<h1>${data.designacao}</h1>`);
                res.write(`<p><b>ID do Curso:</b> ${data.id}</p>`);
                res.write(`<p><b>Duração:</b> ${data.duracao} anos</p>`);
                res.write(`<p><b>Instrumento:</b> ${data.instrumento['#text']} - ${data.instrumento['id']}</p>`);
                res.write('<a href="javascript:history.back()">Voltar</a>');
                res.end();
            })
            .catch((erro) => {
                console.log("Erro: " + erro);
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end("<p>" + erro + "</p>");
            });

    } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('Página não encontrada');
    }
}).listen(2002);

console.log("Servidor à escuta na porta 2002");
