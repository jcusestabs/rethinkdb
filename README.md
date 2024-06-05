# Realtime Database

Este es un proyecto de una base de datos en tiempo real que utiliza tecnologías como Node.js, Express, RethinkDB y WebSocket para permitir la inserción y visualización de comentarios en tiempo real.

## Instalación

1. Clona este repositorio en tu máquina local usando Git.
2. Asegúrate de tener Node.js y npm instalados en tu sistema.
3. Instala las dependencias del servidor ejecutando `npm install` dentro de la carpeta del servidor (`server/`).
4. ademas de instalar docker-compose
5. Ejecutar el comando 'docker-compose up --build'

## Configuración

Antes de ejecutar el servidor, asegúrate de tener RethinkDB instalado y en funcionamiento. Puedes encontrar instrucciones de instalación en [rethinkdb.com](https://rethinkdb.com/docs/install/).

### Puertos Utilizados

- El **servidor Express** corre en el puerto `3000`. Asegúrate de que este puerto esté libre o cambia la configuración del puerto en el archivo `server.js` si es necesario.
- El **WebSocket** escucha en el puerto `8080`. También debes asegurarte de que este puerto no esté siendo utilizado por otra aplicación.
- **RethinkDB**  para conexiones de cliente y `8080` para su consola de administración web.

## Uso

1. Inicia RethinkDB en tu sistema.
2. Ejecuta el servidor Node.js con el comando `node server.js` dentro de la carpeta `server/`.
3. Abre el archivo `index.html` en la carpeta `client/` con un navegador para acceder a la interfaz de usuario.
4. Introduce tu nombre y un comentario en el formulario y presiona "Enviar Comentario" para ver cómo aparece en la lista de comentarios en tiempo real.
