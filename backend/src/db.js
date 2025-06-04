
// This is the database configuration for the application
import pkg from 'pg';
const { Pool } = pkg;

export const db = new Pool({ // config for the database， it is a pool of connections to the database and automatically disconnects when the connection is not used
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "kevinhh",
  database: "TDL",
});