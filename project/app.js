require('dotenv').config();
const express = require('express');
const mysql2 = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const { error, log } = require('console');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// mengkoneksikan db ke .env 
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// menampilkan seluruh db
app.get('/api/users', async(req,res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM users');
        // const [rows] = await pool.query('SELECT nama, umur FROM users);
        res.json(rows);
    }catch(err){
        res.status(500).json({error: err.massage});
    }
});

// input nama and umur to web
app.post('/api/users', async(req,res) => {
    const {nama, umur} = req.body;
    try{
        const [result] = await pool.query('INSERT INTO users (nama, umur) VALUES (?, ?)', [nama,umur]);
        res.json({massage: 'Berhasil ditambah', id:result.insertId});
    }catch(err){
        res.atatus(500).json({error: err.massage});
    }
});

// menghapus db to web
app.delete('/api/users/:id', async(req,res) => {
    const {id} = req.params;
    try{
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({massage: 'Berhasil dihapus'});
    }catch(err){
        res.status(500).json({error: err.massage});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));
