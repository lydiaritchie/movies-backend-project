const knex = require("../db/connection");

const tableName = "theaters";

function read(theaterId){
    return knex(tableName).select("*").where({theater_id: theaterId}).first();
}

module.exports = {
    read,
};