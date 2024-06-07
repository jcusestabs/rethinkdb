const rethinkdbdash = require('rethinkdbdash');

// Configuración de la conexión a la base de datos RethinkDB
const r = rethinkdbdash({
  host: 'rethinkdb', // Nombre del host (debe coincidir con el nombre del servicio en docker-compose.yml)
  port: 28015,       // Puerto para la conexión (predeterminado 28015 para RethinkDB)
  db: 'test'         // Nombre de la base de datos (cambiar si es necesario)
});

module.exports = r; // Exporta la conexión para ser utilizada en otros módulos
