const express = require('express');
const cors = require('cors');
const r = require('rethinkdb');
const app = express();

// Middleware para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Variable para almacenar la conexión a RethinkDB
let connection = null;

// Conectar a RethinkDB y asegurar que la base de datos y la tabla existan
r.connect({ host: 'rethinkdb', port: 28015 }, async (err, conn) => {
    if (err) throw err;
    connection = conn;
    await ensureDbAndTable(conn, 'test', 'comentarios');
});

// Función para asegurar que la base de datos y la tabla existan
async function ensureDbAndTable(conn, dbName, tableName) {
    const dbExists = await r.dbList().contains(dbName).run(conn);
    if (!dbExists) {
        await r.dbCreate(dbName).run(conn);
    }
    const tableExists = await r.db(dbName).tableList().contains(tableName).run(conn);
    if (!tableExists) {
        await r.db(dbName).tableCreate(tableName).run(conn);
    }
}

// Ruta para insertar datos en la base de datos
app.post('/insert', (req, res) => {
    const { db, table, data } = req.body;
    r.db(db).table(table).insert(data)
    .run(connection, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: err.message }); // Responder con mensaje de error
        } else {
            console.log('Data inserted successfully:', result);
            res.status(200).json({ success: true }); // Responder con mensaje de éxito
        }
    });
});

// Ruta para obtener datos de la base de datos
app.get('/get', (req, res) => {
    const { db, table } = req.query;
    r.db(db).table(table).run(connection, (err, cursor) => {
        if (err) res.status(500).send(err);
        else {
            cursor.toArray((err, result) => {
                if (err) res.status(500).send(err);
                else res.send(result);
            });
        }
    });
});

// Ruta para eliminar datos de la base de datos por ID
app.delete('/delete/:id', (req, res) => {
    const { db, table } = req.query;
    const commentId = req.params.id; // Obtiene el ID del comentario desde el URL

    r.db(db).table(table).get(commentId).delete({ returnChanges: true })
        .run(connection, (err, result) => {
            if (err) {
                console.error('Error deleting comment:', err);
                res.status(500).json({ error: err.message });
            } else if (result.deleted === 0) {
                res.status(404).json({ message: "Comment not found." });
            } else {
                console.log('Comment deleted successfully:', result.changes[0].old_val);
                res.status(200).json(result.changes[0].old_val); // Devuelve el comentario eliminado
            }
        });
});

// Ruta para actualizar comentarios
app.put('/update', (req, res) => {
    const { db, table, data } = req.body;
    const { id, ...updateData } = data;

    r.db(db).table(table).get(id).update(updateData, { return_changes: true })
        .run(connection, (err, result) => {
            if (err) {
                console.error('Error updating data:', err);
                res.status(500).json({ error: err.message });
            } else if (result.replaced === 0) {
                res.status(404).json({ message: "Comment not found or no changes made." });
            } else {
                console.log('Data updated successfully:', result);
                res.status(200).json({ success: true, changes: result.changes });
            }
        });
});
// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});