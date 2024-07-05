const knex = require("../db/connection");

const tableName = "movies";

//Create, Read, Update, Delete

function list(){
    return knex(tableName).select();
}

function listMovieTheaters(){
    return knex("movies_theaters").select();
}

module.exports = {
    list,
    listMovieTheaters,
};