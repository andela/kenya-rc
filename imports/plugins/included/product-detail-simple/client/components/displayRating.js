import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "/imports/plugins/core/ui/client/components";

export const calculateAverageRating = reviews => {
  const totalRatings = reviews.map(review => review.rating)
    .reduce((total, rating) => total + rating, 0);
  const reviewCount = reviews.length;
  return reviewCount ? Math.floor((totalRatings / reviewCount) * 100) / 100 : 0;
};

const DisplayRating = ({ containerClasses, reviews }) => {
  return (
    <Card className={containerClasses}>
      <CardBody>
        <div className="text-center card-body">
          <span>
            <h4 className="text-center">
            RATING
            </h4>
          </span>
          <span><h1 className="text-center average-rating">
            {calculateAverageRating(reviews)}
          </h1></span>
          <small
            className="text-muted"
          > Rated by {reviews.length} customer(s)
          </small>
        </div>
      </CardBody>
    </Card>
  );
};

DisplayRating.propTypes = {
  containerClasses: PropTypes.string,
  reviews: PropTypes.arrayOf(PropTypes.object).isRequired
};

DisplayRating.defaultProps = {
  containerClasses: ""
};

export default DisplayRating;
