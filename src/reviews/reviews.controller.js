const service = require("./reviews.service");
const sharedService = require("../utils/shared.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const theatersService = require("../theaters/theaters.service");

//Create, Read, Update, Delete

function reviewExists(req, res, next) {
  service
    .read(req.params.reviewId)
    .then((review) => {
      if (review) {
        res.locals.review = review;
        return next();
      }
      next({ status: 404, message: `Review cannot be found.` });
    })
    .catch((error) => {
      next(error);
    });
}

//The original review is stores in res.locals.review
//The new data (score & content) are in req.body.data
//Add the critic as its own proptery
async function update(req, res, next) {
  const currentReview = res.locals.review;
  const critics = await sharedService.listCritics();
  const criticObj = critics.find(
    (critic) => critic.critic_id === currentReview.critic_id
  );

  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: currentReview.review_id,
  };

  await service.update(updatedReview);

  const afterReview = await service.read(currentReview.review_id);
  const resObj = {
    ...afterReview,
    critic: criticObj,
  };

  res.json({"data": resObj});

}

async function destroy(req, res, next) {
  await service.destroy(res.locals.review.review_id);
  res.sendStatus(204);
}

module.exports = {
  delete: [reviewExists, asyncErrorBoundary(destroy)],
  update: [reviewExists, asyncErrorBoundary(update)],
};
