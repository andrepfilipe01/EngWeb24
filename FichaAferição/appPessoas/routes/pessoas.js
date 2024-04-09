var express = require('express');
var router = express.Router();
var pessoas = require('../controllers/pessoa')

/* GET users listing. */
router.get('/', function(req, res, next) {
  pessoas.list()
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
});

router.get('/:id', function(req, res, next) {
  pessoas.findById(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
});

router.post('/', function(req, res, next) {
  pessoas.insert(req.body)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
});

router.post('/:id', function(req, res, next) {
  pessoas.update(req.params.id, req.body)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
});

router.delete('/:id', function(req, res, next) {
  pessoas.remove(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
