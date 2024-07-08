const knex = require("../db/connection");

const tableName = "reviews";

//Create, Read, Update, Delete

function read(review_id){
    return knex(tableName).select("*").where({review_id}).first();
}

function update(updatedReview){
    return knex(tableName)
        .select("*")
        .where({review_id: updatedReview.review_id})
        .update(updatedReview, "*")
        .returning("*");
}

function destroy(review_id){
    return knex(tableName).where({review_id}).del();
}

module.exports = {
    read,
    update,
    destroy,
};