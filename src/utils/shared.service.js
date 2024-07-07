/*
    Shared service files for knex queries that are used often by all three routes.
    Most used are each database table.
*/

const knex = require("../db/connection");

//Create, Read, Update, Delete

function listMovies(){
    return knex("movies").select("*");
}

function listTheaters(){
    return knex("theaters").select("*");
}

function listReviews(){
    return knex("reviews").select("*");
}

function listCritics(){
    return knex("critics").select("*");
}

function listTheatersMovies(){
    return knex("")
}

function listMoviesWithTheaters(){
    return knex("movies_theaters").select();
}

module.exports = {
    listMovies, 
    listTheaters,
    listReviews,
    listCritics,
    listMoviesWithTheaters,
}