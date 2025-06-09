// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // nodig voor Render
  }
});

module.exports = pool;

// Deze module maakt verbinding met de PostgreSQL database
// en exporteert een pool object dat gebruikt kan worden om queries uit te voeren.
// Zorg ervoor dat de DATABASE_URL omgeving variabele is ingesteld in je .env bestand.
// De ssl optie is ingesteld om verbinding te maken met Render's PostgreSQL database.