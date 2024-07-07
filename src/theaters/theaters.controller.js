const theaterService = require("./theaters.service");
const sharedService = require("../utils/shared.service");
const movieService = require("../movies/movies.service");
const reduceProperties = require("../utils/reduce-properties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//These two need to be wrapped in the asyncErrorBoundary!
async function getTheaterById(theaterId) {
    try{
        const theaterData = await theaterService.read(theaterId);
        return theaterData;
    } catch (error) {
        throw error;
    }
 
}

async function getMovieById(movieId) {
  return await movieService.read(movieId);
}

const fetchData = async () => {
    let data = [];
    const moviesTheatersObjs = await sharedService.listMoviesWithTheaters();
  
    const theaterPromises = moviesTheatersObjs.map((movieTheaterObj) =>
      getTheaterById(movieTheaterObj.theater_id)
    );
  
    const moviePromises = moviesTheatersObjs.map((movieTheaterObj) =>
      getMovieById(movieTheaterObj.movie_id)
    );
  
    try {
      const theatersData = await Promise.all(theaterPromises);
      const moviesData = await Promise.all(moviePromises);
  
      for (let i = 0; i < moviesTheatersObjs.length; i++) {
        const newObject = {
          ...theatersData[i],
          ...moviesData[i],
        };
        data.push(newObject);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  
    return data;
  };

async function list(req, res, next) {
  //need all theaters, all movies and theaters and movies objs
  const moviesTheatersObjs = await sharedService.listMoviesWithTheaters();
 
  const data = await fetchData();

  const reduceTheaterAndMovies = reduceProperties("theater_id", {
    theater_id: ["theater", "theater_id"],
    name: ["theater", "name"],
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    rating: ["movies", null, "rating"],
  });

  const result = reduceTheaterAndMovies(data);
  res.json({ result });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
