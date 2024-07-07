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
 
  const data = await fetchData();

  const reduceTheaterAndMovies = reduceProperties("theater_id", {
    theater_id: ["theater_id"],
    name: ["name"],
    address_line_1: ["address_line_1"],
    city: ["city"],
    state: ["state"],
    zip: ["zip"],
    created_at: ["created_at"],
    updated_at: ["updated_at"],
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    created_at: ["movies", null, "created_at"],
    updated_at: ["movies", null, "updated_at"],
    is_showing: ["movies", null, "is_showing"],
    theater_id: ["movies", null, "theater_id"],
  });

  const result = reduceTheaterAndMovies(data);
  res.json({ "data": result });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
