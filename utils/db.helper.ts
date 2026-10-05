import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
}); 

export const dbHelper = {
    async query(sqlQuery: string, params: any[] = []) {
        const client = await pool.connect();
        try {
            const result = await client.query(sqlQuery, params);
            return result.rows;
        } catch (error) {
            console.error('database query error:', error);
            throw error;
        } finally {
            client.release();
        }
    }
};