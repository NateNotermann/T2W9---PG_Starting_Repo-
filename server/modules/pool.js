const pg = require('pg');

const Pool = pg.Pool;

// create a new pool instance to manage our connections
const pool = new Pool({
    database: 'music_library',
    host: 'localhost',
    port: 5432, // 5432 is default for Postgres
    max: 10, // how many connections (queries) at one time
    idleTimeoutMillis: 30000 // 30 seconds to try to connect, otherwise query is cancelled
});

// not required but useful for debugging
pool.on('connect', () => {
    console.log('Postgres connected! WOOOO');
});

pool.on('error', (error) => {
  console.log('Error with postgres pool', error);
});

// allow access to this pool from other code
module.exports = pool;