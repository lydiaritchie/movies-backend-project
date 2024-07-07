const knex = require("../db/connection");

const tableName = "movies";

//Create, Read, Update, Delete

function read(movieId){
    return knex(tableName).select("*").where({movie_id: movieId}).first();
}


module.exports = {
    read,
};