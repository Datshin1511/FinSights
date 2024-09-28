import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'QcT->220124>>hertech',
    database: 'finsights_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default pool