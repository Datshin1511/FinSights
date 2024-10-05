import express from 'express'
import dotenv from 'dotenv'

import pool from '../db/conn.js'

dotenv.config()

const router = express.Router()

router.get('/search-company', async (req, res) => {
    const searchQuery = req.query.search

    const companySearchQuery = `SELECT * FROM company WHERE name LIKE ? ORDER BY name;`
    const distinctCompanyNameQuery = 'SELECT DISTINCT * FROM company WHERE name LIKE ? ORDER BY name;'

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

router.get('/no-of-companies', async (req, res) => {
    const companyId = req.query.id

    const companyCountQuery = `SELECT COUNT(*) AS 'numberOfCompanies' FROM company WHERE country_code = (SELECT country_code FROM company WHERE id = ?);`
    const x = 'SELECT * FROM company WHERE country_code = (SELECT country_code FROM company WHERE id = ?);'

    try{
        const [rows] = await pool.query(companyCountQuery, [companyId])

        console.log(rows)

        if(rows.length > 0){
            return res.status(200).json(rows)
        }
        else{
            return res.status(500).send("No companies found")
        }
    }
    catch(err){
        console.log("Error: ", err)
    }
})

router.get('/greater-diversity', async (req, res) => {
    const companyId = req.query.id

    const greaterDiversity = `SELECT COUNT(*) AS greaterDiversity FROM company WHERE
                              country = (SELECT country FROM company WHERE id = ?) AND
                              diversity > (SELECT diversity FROM company WHERE id = ?)`
                            
    try{
        const [rows] = await pool.query(greaterDiversity, [companyId, companyId])

        console.log(rows)

        if(rows.length > 0){
            return res.status(200).json(rows)
        }
        else{
            return res.status(500).send("No companies found")
        }
    }
    catch(err){
        console.log("Error: ", err)
    }
    
    
})

router.get('/company-stats', async (req, res) => {
    const companyId = req.query.id

    const query = `SELECT 
                    s1.year AS currentYear,
                    s2.year AS previousYear,
                    (s1.stock_price - s2.stock_price) AS stockPriceChange,
                    (s1.market_share - s2.market_share) AS marketShareChange,
                    (s1.revenue - s2.revenue) AS revenueChange,
                    (s1.expense - s2.expense) AS expenseChange
                   FROM statistics s1 JOIN statistics s2
                   ON s1.company_id = s2.company_id
                   AND s1.year = s2.year + 1
                   WHERE s1.company_id = ?
                   ORDER BY s1.year`

    try{
        const [rows] = await pool.query(query, [companyId])

        console.log(rows)

        if(rows.length > 0){
            return res.status(200).json(rows)
        }
        else{
            return res.status(500).send("No record found")
        }
    }
    catch(err){
        console.log("Error: ", err)
    }
})

router.get('/company-stats/domestic-greater', async(req, res) => {
    const companyId = req.query.id

    const query = `SELECT 
                    COUNT(*) AS greaterStockPrice,
                    COUNT(*) AS greaterMarketShare,
                    COUNT(*) AS greaterRevenue,
                    COUNT(*) AS greaterExpense
                   FROM statistics s JOIN company c
                   ON s.company_id = c.id
                   WHERE c.country_code = (SELECT country_code FROM company WHERE id = ?)
                   AND s.stock_price > (SELECT stock_price FROM statistics WHERE company_id = ?)
                   OR s.market_share > (SELECT market_share FROM statistics WHERE company_id = ?)
                   OR s.revenue > (SELECT revenue FROM statistics WHERE company_id = ?)
                   OR s.expense > (SELECT expense FROM statistics WHERE company_id = ?)`

    try{
        const [rows] = await pool.query(query, [companyId, companyId, companyId, companyId, companyId])

        console.log(rows)

        if(rows.length > 0){
            return res.status(200).json(rows)
        }
        else{
            return res.status(500).send("No records found")
        }
    }
    catch(err){
        console.log("Error: ", err)
    }
})

router.get('/company-stats/global-greater', async(req, res) => {
    const companyId = req.query.id

    const query = `SELECT 
                    COUNT(*) AS greaterStockPrice,
                    COUNT(*) AS greaterMarketShare,
                    COUNT(*) AS greaterRevenue,
                    COUNT(*) AS greaterExpense
                   FROM statistics s JOIN company c
                   ON s.company_id = c.id
                   WHERE s.stock_price > (SELECT stock_price FROM statistics WHERE company_id = ?)
                   OR s.market_share > (SELECT market_share FROM statistics WHERE company_id = ?)
                   OR s.revenue > (SELECT revenue FROM statistics WHERE company_id = ?)
                   OR s.expense > (SELECT expense FROM statistics WHERE company_id = ?)`

    try{
        const [rows] = await pool.query(query, [companyId, companyId, companyId, companyId, companyId])

        console.log(rows)

        if(rows.length > 0){
            return res.status(200).json(rows)
        }
        else{
            return res.status(500).send("No records found")
        }
    }
    catch(err){
        console.log("Error: ", err)
    }
})


export default router