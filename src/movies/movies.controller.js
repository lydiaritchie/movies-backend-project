const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Create, Read, Update, Delete

async function list(req, res){
    const { is_showing } = req.query;
    const allMovies = await service.list();
    const moviesTheaters = await service.listMovieTheaters();

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
        return res.json({data:filteredMovies});
    } 
    //else respond with all movies
    res.json({ data: allMovies });
}

async function listShowing(req, res){
    const movies = await service.list();
    
    
}

module.exports = {
    list: asyncErrorBoundary(list),
    listShowing: asyncErrorBoundary(listShowing),
};