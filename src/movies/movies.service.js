const knex = require("../db/connection");

const tableName = "movies";

//Create, Read, Update, Delete

function list(){
    return knex(tableName).select();
}

module.exports = {
    list,
};