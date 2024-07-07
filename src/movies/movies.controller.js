const service = require("./movies.service");
const sharedService = require("../utils/shared.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


//Create, Read, Update, Delete

async function getMoviesTheaters(req, res, next){
    const moviesTheaters = await sharedService.listMoviesWithTheaters();
    res.locals.moviesTheaters = moviesTheaters;
    next();
}

function movieExists(req, res, next){
    service
        .read(req.params.movieId)
        .then((movie) => {
            if(movie) {
                res.locals.movie = movie;
                return next();
            }
            next(({ status: 404, message: `Movie cannot be found.`}));
        })
        .catch((error) => {
            next(error);
        })
}

async function list(req, res){
    const { is_showing } = req.query;
    const allMovies = await sharedService.listMovies();
    const moviesTheaters = res.locals.moviesTheaters;

    if(is_showing){
        //Only respond with the movies that are showing
        const movieIds = [];
        moviesTheaters.forEach((showingObj) => {
            if(showingObj.is_showing && !movieIds.includes(showingObj.movie_id)){
                movieIds.push(showingObj.movie_id);
            }
        })
        //if a movie's id is in the movieIds array then display it
        const filteredMovies = allMovies.filter((movie) => {
            return movieIds.includes(movie.movie_id);
        })
        return res.json({data: filteredMovies});
    } 
    //else respond with all movies
    res.json({ data: allMovies });
}


function read(req, res, next){
    res.json({data: res.locals.movie});
}

async function getTheatersByMovie(req, res, next){
    //Collect theater ids for the movieId
    const movieId = res.locals.movie.movie_id;
    const theaterIds = [];
    res.locals.moviesTheaters.forEach((showingObj) => {
        if(showingObj.is_showing && movieId === showingObj.movie_id && !theaterIds.includes(showingObj.movie_id)){
            theaterIds.push(showingObj.theater_id);
        }
    })

    //Get a list of all theaters
    const theaters = await sharedService.listTheaters();

    //Go through all theaters and filter them if their id is in theaterIds
    const filteredTheaters = theaters.filter((theater) => {
        return theaterIds.includes(theater.theater_id);
    })

    res.json({data: filteredTheaters});
}

//Get all reviews, then filter them for the current movie
//For each review add the critic details
//   - Get the critics data
//   - Add the data with a critics key
async function getReviewsByMovie(req, res, next){
    const movieId = res.locals.movie.movie_id;
    const reviews = await sharedService.listReviews();
    const critics = await sharedService.listCritics();
    
    const filteredReviews = reviews.filter((review) => {
        return review.movie_id === movieId;
    })

    //for each review, find the critic by id and insert them
    filteredReviews.forEach((review) => {
        const criticObj = critics.find(critic => critic.critic_id === review.critic_id);
        review.critic = criticObj;
    });

    res.json({data: filteredReviews});
}

module.exports = {
    list: [asyncErrorBoundary(getMoviesTheaters), asyncErrorBoundary(list)],
    read: [movieExists, read],
    listMovieTheaters: [movieExists, asyncErrorBoundary(getMoviesTheaters), asyncErrorBoundary(getTheatersByMovie)],
    listMovieReviews: [movieExists, asyncErrorBoundary(getReviewsByMovie)],
};