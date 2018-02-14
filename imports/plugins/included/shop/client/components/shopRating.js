import React, { Component } from "react";
import PropTypes from "prop-types";
import { Reaction } from "/client/api";
import { Reviews } from "/lib/collections";
import DisplayRating from "./../../../product-detail-simple/client/components/displayRating";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

class ShopRating extends Component {
  static PropTypes = {
    reviews: PropTypes.arrayOf(PropTypes.any)
  };

  render() {
    return (
      <DisplayRating
        containerClasses="col-md-3 col-md-offset-2"
        reviews={this.props.reviews}
      />
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
    reviews: Reviews.find({
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
