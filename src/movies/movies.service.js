const knex = require("../db/connection");

const tableName = "movies";

//Create, Read, Update, Delete

function list(){
    return knex(tableName).select();
}

function listMoviesWithTheaters(){
    return knex("movies_theaters").select();
}

function read(movieId){
    return knex("movies").select("*").where({movie_id: movieId}).first();
}

function listTheaters(){
    return knex("theaters").select("*");
}

module.exports = {
    list,
    listMoviesWithTheaters,
    read,
    listTheaters,
};