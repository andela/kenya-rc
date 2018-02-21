import React, { Component } from "react";
import PropTypes from "prop-types";
import { ReactionProduct } from "/lib/api";
import { Reviews } from "/lib/collections";
import DisplayRating from "./displayRating";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

class ProductRating extends Component {
  static PropTypes = {
    reviews: PropTypes.arrayOf(PropTypes.any)
  };

  render() {
    return (
      <div>
        <DisplayRating
          reviews={this.props.reviews}
          containerClasses={"col-md-12 product-rating-card"}
        />
      </div>
    );
  }
}

ProductRating.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    review: PropTypes.string
  }))
};

ProductRating.defaultProps = {
  reviews: []
};
const composer = (props, productData) => {
  const productId = ReactionProduct.selectedProductId();
  productData(null, {
    reviews: Reviews.find(
      { productId },
      { sort: { createdAt: -1 }, limit: 1000 }).fetch()
  });
};

registerComponent("ProductReview", ProductRating);

export default composeWithTracker(composer)(ProductRating);
