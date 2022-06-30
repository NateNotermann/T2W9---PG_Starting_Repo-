const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// const pg = require('pg');

// const Pool = pg.Pool;

// const pool = new Pool({
//     database: 'music_library',
//     host: 'localhost',
//     port: 5432, // 5432 is default for Postgres
//     max: 10, // how many connections (queries) at one time
//     idleTimeoutMillis: 30000 // 30 seconds to try to connect, otherwise query is cancelled
// });

// // not required but useful for debugging
// pool.on('connect', () => {
//     console.log('Postgres connected! WOOOO');
// });

// pool.on('error', (error) => {
//   console.log('Error with postgres pool', error);
// });

let songs = [{
    rank: 355,
    artist: 'Ke$ha',
    track: 'Tik-Toc',
    published: '1/1/2009'
  },
  {
    rank: 356,
    artist: 'Gene Autry',
    track: 'Rudolph, the Red-Nosed Reindeer',
    published: '1/1/1949'
  },
  {
    rank: 357,
    artist: 'Oasis',
    track: 'Wonderwall',
    published: '1/1/1996'
  }
];

router.get('/', (req, res) => {
  // res.send(songs);
  let queryText = 'SELECT * FROM "songs" ORDER BY "rank";';
  pool.query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log('Error in GET query:', error);
      res.sendStatus(500);
    });
});

// example: /songs/3
router.get('/:id', (req, res) => {
  // res.send(songs);
  const idToGet = req.params.id;
  let queryText = 'SELECT * FROM "songs" WHERE "id" = $1;';
  pool.query(queryText, [idToGet])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log('Error in GET query:', error);
      res.sendStatus(500);
    });
});

// example: /songs/artist/Mahmoud
router.get('/artist/:artist', (req, res) => {
  // res.send(songs);
  const artistToGet = req.params.artist;
  let queryText = 'SELECT * FROM "songs" WHERE artist = $1;';
  pool.query(queryText, [artistToGet])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log('Error in GET query:', error);
      res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
  // songs.push(req.body);
  // res.sendStatus(200);
  const newSong = req.body;
  const queryText = `
      INSERT INTO "songs" ("artist", "track", "published", "rank")
      VALUES ($1, $2, $3, $4);
    `;
  // INSERT INTO "songs" ("artist", "track", "published", "rank")
  // VALUES ('Paul Simon', 'Graceland', '1986-10-25', 5); DELETE FROM "songs";--")
  pool.query(queryText, [newSong.artist, newSong.track, newSong.published, newSong.rank])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log('Error POSTing to db:', error);
      res.sendStatus(500);
    })
});

router.delete('/:id', (req, res) => {
  let reqId = req.params.id;
  console.log(`Delete request sent for id ${reqId}`);
  let queryText = 'DELETE FROM "songs" WHERE id = $1;';
  pool.query(queryText, [reqId])
    .then(() => {
      console.log('Song deleted!');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(`Error deleting with query ${queryText}: ${error}`);
      res.sendStatus(500); // good server always responds
    })
})


router.put('/rank/:id', (req, res) => { 
  let songId = req.params.id;
  //expect direction to go up or down
  let direction = req.body.direction;
  console.log( songId + ' ' + direction );

  let queryText;
  if (direction === 'up') {
    queryText = 'UPDATE "songs" SET rank = rank-1 WHERE id = $1;';
  } else if (direction === 'down') {
    queryText = 'UPDATE "songs" SET rank = rank+1 WHERE id = $1;';
  } else {
    // if we don't get an expected direction 
    res.sendStatus(500);
    return;
  }

  pool.query(queryText, [songId])
    .then((dbResponse) => {
      res.send(dbResponse.rows);
    })
    .catch((error) => {
      console.log(`Error UPDATing with query ${queryText}: ${error}`);
      res.sendStatus(500);
    })
})





module.exports = router;