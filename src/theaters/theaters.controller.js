const service = require("./theaters.service");
const sharedService = require("../utils/shared.service");
const reduceProperties = require("../utils/reduce-properties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next){
    const theatersList = await sharedService.listTheaters();
    const reduceTheaterAndMovies = reduceProperties("theater_id", {
        theater_id: ["theater", "theater_id"],
        name: ["theater", "name"],
        movie_id: ["movies", null, "movie_id"],
        title: ["movies", null, "title"],
        rating: ["movies", null, "rating"],
      });
    const result = reduceTheaterAndMovies(theatersList);
    res.json({result});
}

module.exports = {
    list,
};