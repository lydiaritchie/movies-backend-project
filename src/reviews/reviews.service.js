const knex = require("../db/connection");

const tableName = "reviews";

function read(review_id){
    return knex(tableName).select("*").where({review_id}).first();
}

function destroy(review_id){
    return knex(tableName).where({review_id}).del();
}

module.exports = {
    read,
    destroy,
};