// config.js
const rethinkdbdash = require('rethinkdbdash');

const r = rethinkdbdash({
  host: 'rethinkdb', // Este nombre debe coincidir con el nombre del servicio en docker-compose.yml
  port: 28015,
  db: 'test' // Cambia esto al nombre de tu base de datos si es necesario
});

module.exports = r;
