require('dotenv').config()
const pool = require('./db')

async function setup() {
    const client = await pool.connect()

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS artifacts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                mood_tag TEXT,
                era_tag TEXT,
                is_anonymous INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS branches (
                id SERIAL PRIMARY KEY,
                artifact_id INTEGER NOT NULL REFERENCES artifacts(id),
                user_id INTEGER NOT NULL REFERENCES users(id),
                body TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS reactions (
                id SERIAL PRIMARY KEY,
                artifact_id INTEGER NOT NULL REFERENCES artifacts(id),
                user_id INTEGER NOT NULL REFERENCES users(id),
                emoji TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(artifact_id, user_id)
            )
        `)

    } finally {
        client.release()
    }
}

setup().then(() => process.exit(0)).catch(err => {
    console.error(err)
    process.exit(1)
})