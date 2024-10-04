import express from 'express'
import dotenv from 'dotenv'

import pool from '../db/conn.js'

dotenv.config()

const router = express.Router()

router.get('/search-company', async (req, res) => {
    const searchQuery = req.query.search

    const companySearchQuery = `SELECT * FROM company WHERE name LIKE ?`
    const distinctCompanyNameQuery = 'SELECT DISTINCT * FROM company WHERE name LIKE ?'

    try{
        const [rows] = await pool.query(companySearchQuery, `%${searchQuery}%`);
        const [distinctCompanies] = await pool.query(distinctCompanyNameQuery, `%${searchQuery}%`)

        const data = {
            rows: rows,
            distinctCompanies: distinctCompanies
        }

        console.log(data)

        if (rows.length > 0) {
            return res.status(200).json(data);
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

router.post('/')

export default router