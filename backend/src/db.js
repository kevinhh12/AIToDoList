
// This is the database configuration for the application
import pkg from 'pg';
const { Pool } = pkg;

export const db = new Pool({ // config for the database， it is a pool of connections to the database and automatically disconnects when the connection is not used
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});