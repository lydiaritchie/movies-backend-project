const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Create, Read, Update, Delete

async function list(req, res){
    const data = await service.list();
    res.json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list),
};