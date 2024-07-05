const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


//Create, Read, Update, Delete

function reviewExists(req, res, next){
    service
        .read(req.params.reviewId)
        .then((review) => {
            if(review) {
                res.locals.review = review;
                return next();
            }
            next(({ status: 404, message: `Review cannot be found.`}));
        })
        .catch((error) => {
            next(error);
        })
}

async function destroy(req, res, next){
    await service.destroy(res.locals.review.review_id);
    res.sendStatus(204);
}

module.exports = {
    delete: [reviewExists, asyncErrorBoundary(destroy)],
};