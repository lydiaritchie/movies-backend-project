const knex = require("../db/connection");

const tableName = "movies";

//Create, Read, Update, Delete

function list(){
    return knex(tableName).select();
}

function listMovieTheaters(){
    return knex("movies_theaters").select();
}

function read(movieId){
    return knex("movies").select("*").where({movie_id: movieId}).first();
}

module.exports = {
    list,
    listMovieTheaters,
    read,
};