const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Create, Read, Update, Delete

async function getMoviesTheaters(req, res, next){
    const moviesTheaters = await service.listMovieTheaters();
    res.locals.moviesTheaters = moviesTheaters;
    next();
}

async function list(req, res){
    const { is_showing } = req.query;
    const allMovies = await service.list();
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

function read(req, res, next){
    res.json({data: res.locals.movie});
}

async function getTheatersByMovie(req, res, next){

}

module.exports = {
    list: [asyncErrorBoundary(getMoviesTheaters), asyncErrorBoundary(list)],
    read: [movieExists, read],
};