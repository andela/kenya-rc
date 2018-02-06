import React, { Component } from "react";
import PropTypes from "prop-types";
import { Reaction } from "/client/api";
import { ShopReviews } from "/lib/collections";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

class ShopRating extends Component {
  static PropTypes = {
    reviews: PropTypes.arrayOf(PropTypes.any)
  };

  render() {
    const { reviews } = this.props;
    const totalRatings = reviews.map(review => review.rating)
      .reduce((total, rating) => total + rating, 0);
    const reviewCount = reviews.length;
    const shopAverageRating = reviewCount ? Math.floor((totalRatings / reviewCount) * 100) / 100 : 0;
    return (
      <div className="text-center card-body">
        <span><h4 className="text-center">
          RATING
        </h4></span>
        <span><h1 className="text-center average-rating">
          { shopAverageRating }
        </h1></span>
        <small className="text-muted"> Rated by {reviews.length} customer(s)</small>
      </div>
    );
  }
}
ShopRating.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    review: PropTypes.string
  }))
};

ShopRating.defaultProps = {
  reviews: []
};
const composer = (props, shopData) => {
  const shopId = Reaction.Router.getQueryParam("_");
  shopData(null, {
    reviews: ShopReviews.find({
      shopId
    }, {
      sort: {
        createdAt: -1
      }
    }).fetch()
  });
};

registerComponent("ShopReview", ShopRating);

export default composeWithTracker(composer)(ShopRating);
