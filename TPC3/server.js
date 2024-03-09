var http = require('http');
var url = require('url');
var axios = require('axios');
var fs = require('fs')

function lerDados(callback) {
    fs.readFile('filmes.json', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error('Arquivo "filmes.json" não encontrado.');
            } else {
                console.error('Erro ao ler o arquivo:', err.message);
            }
            return;
        }
        callback(JSON.parse(data));
    });
}

http.createServer((req, res) => {

    var q = url.parse(req.url, true);
    const path = q.pathname;

    if (path == "/filmes") {
        axios.get("http://localhost:3000/filmes")
            .then((resp) => {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write('<h1>Índice de Filmes</h1>');
                var data = resp.data;
                for (i in data) {
                    res.write("<li><a href='/filmes/" + data[i].id + "'>" + data[i].title + "</a></li>");
                }
                res.write('</ul>');
                res.end();
            })
            .catch((erro) => {
                console.log("Erro: " + erro);
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end("<p>" + erro + "</p>");
            });
    }
    // GET informações de um filme em específico
    else if (path.startsWith('/filmes/')) {
        const filmeId = path.split("/")[2];
        axios.get("http://localhost:3000/filmes/" + filmeId)
        .then((resp) => {
            const data = resp.data;
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.write(`<h1>${data.title}</h1>`);
                res.write(`<p>Ano: ${data.year}</p>`);
                res.write('<a href="javascript:history.back()">Voltar</a>');
                res.end();
        })
        .catch((error) => {
            console.error("Erro ao buscar atores: " + error);
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end("<p>Erro ao buscar filme.</p>");
        });
    }// GET todos os atores
    else if (path.startsWith('/atores')) {
        axios.get("http://localhost:3000/atores")
            .then((resp) => {
                const data = resp.data;
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write('<h1>Lista de Atores</h1>');
                res.write('<ul>');
                data.forEach(actor => {
                    res.write(`<li>${actor.name}</li>`);
                });
                res.write('</ul>');
                res.end();
            })
            .catch((error) => {
                console.error("Erro ao buscar atores: " + error);
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end("<p>Erro ao buscar atores.</p>");
            });
    }


    else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('Página não encontrada');
    }
}).listen(2002);

console.log("Servidor à escuta na porta 2002");
