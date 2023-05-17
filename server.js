/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: _______Emiliya Aghayeva_______________ Student ID: ____148398217__________ Date: _______16/05/2023_________

*  Cyclic Link: _______________________________________________________________
*  
    Github: https://github.com/eaghayeva/web422_assignment1
********************************************************************************/ 

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MoviesDB = require("./modules/moviesDB.js");

const db = new MoviesDB();
const app = express();
app.use(cors());
app.use(express.json());


var HTTP_PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.json({ message: 'API Listening' });
  });
  

//POST /api/movies

app.post('/api/movies', (req, res) => {
    // Get the movie data from the request body
    const movieData = req.body;
  
    // Add the new movie to the database
    db.addNewMovie(movieData)
      .then((newMovie) => {
        // Movie successfully added, return the newly created movie object
        res.status(201).json(newMovie);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Failed to add the movie.' });
      });
  });

// GET /api/movies
app.get('/api/movies', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const title = req.query.title || '';
  
    db.getAllMovies(page, perPage, title)
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Failed to retrieve movies.' });
      });
  });

  // GET /api/movies/:id
app.get('/api/movies/:id', (req, res) => {
    const id = req.params.id;
  
    db.getMovieById(id)
      .then((movie) => {
        if (movie) {
          res.json(movie);
        } else {
          res.status(404).json({ error: 'Movie not found.' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: 'Failed to retrieve movie.' });
      });
  });

  // PUT /api/movies/:id
app.put('/api/movies/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
  
    db.updateMovieById(data, id)
      .then(() => {
        res.json({ message: 'Movie updated successfully.' });
      })
      .catch((err) => {
        res.status(500).json({ error: 'Failed to update movie.' });
      });
  });

// DELETE /api/movies/:id
app.delete('/api/movies/:id', (req, res) => {
    const id = req.params.id;
  
    db.deleteMovieById(id)
      .then(() => {
        res.json({ message: 'Movie deleted successfully.' });
      })
      .catch((err) => {
        res.status(500).json({ error: 'Failed to delete movie.' });
      });
  });
  


  

  // Initialize the database connection

  db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});



