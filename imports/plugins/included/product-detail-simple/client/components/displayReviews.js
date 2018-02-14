import React from "react";
import PropTypes from "prop-types";
import ReactStars from "react-stars";
import { Card, CardHeader, CardBody, ReactionAvatar } from "/imports/plugins/core/ui/client/components";

const DisplayReviews = ({ reviews, user, rating, containerClasses, createReview, review: stateReview, onRatingChange, onInputChange, reviewType }) => {
  const reviewList = reviews.map(review => (
    <div className="media" key={review._id}>
      <div className="media-left">
        <ReactionAvatar
          size={40}
          className={"img-responsive review-avatar"}
          email={review.email}
          name={review.name.length > 1 ? review.name : review.email}
          round
        />
      </div>
      <div className="media-body">
        <h4 className="media-heading">
          <ReactStars
            edit={false}
            onChange={onRatingChange} count={5} size={18}
            value={review.rating}
          />
        </h4>
        <p>
          {review.review}
        </p>
      </div>
    </div>
  ));

  return (
    <Card className={containerClasses}>
      <CardHeader
        i18nKeyTitle={`${reviewType} reviews`}
        title={`${reviewType} reviews`}
      />
      <CardBody>
        {
          user.emails.length > 0 &&

          <div className="row media-container">
            <div className="media">
              <div className="media-left">
                <ReactionAvatar
                  size={40}
                  className={"img-responsive review-avatar"}
                  email={user.emails[0].address}
                  name={user.name}
                  round
                />
              </div>
              <div className="media-body">
                <h4 className="media-heading">
                  <ReactStars
                    onChange={onRatingChange}
                    count={5}
                    size={18}
                    value={rating}
                  />
                </h4>
                <textarea placeholder="Leave a review ..." cols="2" rows="2"
                  className="form-control review-text"
                  value={stateReview}
                  name="review"
                  onChange={onInputChange}
                />
                <div className="add-to-cart">
                  <button
                    className="btn pull-right cart-button"
                    onClick={createReview}
                    disabled={stateReview.length < 8}
                  >Submit review</button>
                </div>
              </div>
            </div>
          </div>
        }
        {
          user.emails.length < 1 &&
          <p className="text-center">Please sign in to add a review</p>
        }
        <div className="review-container">
          {reviewList}
        </div>
      </CardBody>
    </Card>
  );
};

DisplayReviews.propTypes = {
  containerClasses: PropTypes.string,
  createReview: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onRatingChange: PropTypes.func.isRequired,
  rating: PropTypes.number.isRequired,
  review: PropTypes.string.isRequired,
  reviewType: PropTypes.string.isRequired,
  reviews: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.object.isRequired
};

DisplayReviews.defaultProps = {
  containerClasses: ""
};

export default DisplayReviews;
