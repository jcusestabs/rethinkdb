const express = require('express');
const cors = require('cors');
const r = require('rethinkdb');
const app = express();

app.use(express.json());
app.use(cors());

let connection = null;
r.connect({ host: 'rethinkdb', port: 28015 }, async (err, conn) => {
    if (err) throw err;
    connection = conn;
    // Asegurarse de que la base de datos y la tabla existan
    await ensureDbAndTable(conn, 'test', 'comentarios');
});

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

app.post('/insert', (req, res) => {
    const { db, table, data } = req.body;
    r.db(db).table(table).insert(data)
    .run(connection, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: err.message }); // Respond with error message
        } else {
            console.log('Data inserted successfully:', result);
            res.status(200).json({ success: true }); // Respond with success message
        }
    });
});

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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
