import express from 'express'
import dotenv from 'dotenv'

import pool from '../db/conn.js'

dotenv.config()

const router = express.Router()

router.post('/search-company', async (req, res) => {
    const searchQuery = req.body.search

    console.log(searchQuery)

    const sql = `SELECT * FROM companies WHERE name LIKE ?`

    try{
        const [rows] = await pool.query(`SELECT * FROM company WHERE name LIKE ?`, [`%${searchQuery}%`]);

        console.log(rows)

        if (rows.length > 0) {
            return res.status(200).json(rows);
        } 
        else {
            return res.status(404).send('No companies found');
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).send('Server error');
    }
})

export default router