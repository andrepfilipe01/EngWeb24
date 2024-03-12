var http = require('http');
var url = require('url');
var axios = require('axios');
var fs = require('fs')

// Função para criar o dicionário de atores
function criarDicionarioAtores(callback) {
    fs.readFile('filmes.json', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err.message);
            return;
        }
        const filmes = JSON.parse(data).filmes;
        const dicionario = {};

        filmes.forEach(filme => {
            const atores = filme.cast;
            const generos = filme.genres;

            atores.forEach(ator => {
                if (!dicionario[ator]) {
                    dicionario[ator] = [];
                }
                dicionario[ator] = dicionario[ator].concat(generos);
            });
        });

        callback(dicionario);
    });
}

// Função para criar o dicionário de gêneros
function criarDicionarioGeneros(callback) {
    fs.readFile('./filmes.json', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err.message);
            return;
        }
        const filmes = JSON.parse(data).filmes;
        const dicionario = {};

        filmes.forEach(filme => {
            const generos = filme.genres;

            generos.forEach(genero => {
                if (!dicionario[genero]) {
                    dicionario[genero] = [];
                }
                dicionario[genero].push(filme.title);
            });
        });

        callback(dicionario);
    });
}

// Função para buscar os filmes de um ator específico
function buscarFilmesDoAtor(ator, callback) {
    fs.readFile('filmes.json', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err.message);
            return;
        }
        const filmes = JSON.parse(data).filmes;
        const filmesDoAtor = filmes.filter(filme => filme.cast.includes(ator));
        callback(filmesDoAtor);
    });
}

// Função para buscar os atores de um gênero específico
function buscarAtoresDoGenero(genero, callback) {
    fs.readFile('filmes.json', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err.message);
            return;
        }
        const filmes = JSON.parse(data).filmes;
        const atoresDoGenero = {};

        filmes.forEach(filme => {
            const generos = filme.genres;
            const atores = filme.cast;

            if (generos.includes(genero)) {
                atores.forEach(ator => {
                    if (!atoresDoGenero[ator]) {
                        atoresDoGenero[ator] = true;
                    }
                });
            }
        });

        const listaAtores = Object.keys(atoresDoGenero);
        callback(listaAtores);
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

                const elencoLinks = data.cast.map(ator =>
                    `<a href='/atores/${encodeURI(ator)}'>${ator}</a>`
                ).join(', ');
                res.write(`<p>Elenco: ${elencoLinks}</p>`);
                const generosLinks = data.genres.map(genero =>
                    `<a href='/generos/${encodeURI(genero)}'>${genero}</a>`
                ).join(', ');
                res.write(`<p>Gêneros: ${generosLinks}</p>`);
                

                res.write('<a href="javascript:history.back()">Voltar</a>');
                res.end();
        })
        .catch((error) => {
            console.error("Erro ao buscar filmes: " + error);
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end("<p>Erro ao buscar filme.</p>");
        });
    }
    // GET todos os atores
    else if (path == '/atores') {
        criarDicionarioAtores((atores) => {
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.write('<h1>Atores</h1><ul>');
            Object.keys(atores).forEach(ator => {
                res.write(`<li><a href='/atores/${encodeURI(ator)}'>${ator}</a></li>`);
            });
            res.write('</ul>');
            res.end();
        });
    }
    //GET filmes de um ator
    else if(path.startsWith('/atores')){
        const ator = decodeURIComponent(path.substring(8));
        buscarFilmesDoAtor(ator, filmesDoAtor => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(`<h2>Filmes do Ator: ${ator}</h2>`);
            if (filmesDoAtor.length === 0) {
                res.write(`<p>O ator ${ator} não está associado a nenhum filme.</p>`);
            } else {
                res.write('<ul>');
                filmesDoAtor.forEach(filme => {
                    res.write(`<li>${filme.title} (${filme.year})</li>`);
                });
                res.write('</ul>');
            }
            res.end();
        });
    }
    // GET todos os gêneros
    else if(path.startsWith('/generos')){
        criarDicionarioGeneros((generos) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write('<h1>Gêneros</h1><ul>');
            Object.keys(generos).forEach(genero => {
                res.write(`<li><a href='/generos/${encodeURI(genero)}'>${genero}</a></li>`);
            });
            res.write('</ul>');
            res.end();
        });
    }
    // GET filmes de um gênero específico
    else if (pathname.startsWith('/generos/')) {
        const genero = decodeURI(path.split("/")[2]);
        construirDicionarioGeneros((generos) => {
            const filmesGenero = generos[genero] || [];

            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.write(`<h1>Filmes de Gênero: ${genero}</h1><ul>`);
            filmesGenero.forEach(({ title, id }) => {
                res.write(`<li><a href='/filmes/${id}'>${title}</a></li>`);
            });
            res.write('</ul>');
            res.write('<a href="javascript:history.back()">Voltar</a>');
            res.end();
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('Página não encontrada');
    }
}).listen(2002);

console.log("Servidor à escuta na porta 2002");
