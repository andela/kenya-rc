import React, { Component } from "react";
import PropTypes from "prop-types";
import { ReactionProduct } from "/lib/api";
import { ProductReviews } from "/lib/collections";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

class ProductRating extends Component {
  static PropTypes = {
    reviews: PropTypes.arrayOf(PropTypes.any)
  };

  render() {
    const { reviews } = this.props;
    const totalRatings = reviews.map(review => review.rating)
      .reduce((total, rating) => total + rating, 0);
    const productAverageRating = Math.floor((totalRatings / reviews.length) * 100) / 100;
    return (
      <div className="text-center">
        <h1 className="text-center">
          { productAverageRating }
        </h1>
        <small className="text-muted"> No. of people that have rated this product: {reviews.length}</small>
      </div>
    );
  }
}

const composer = (props, productData) => {
  productData(null, {
    reviews: ProductReviews.find({
      productId: ReactionProduct.selectedProduct()
    }, {
      sort: {
        createdAt: -1
      }
    }).fetch()
  });
};

registerComponent("ProductReview", ProductRating);

export default composeWithTracker(composer)(ProductRating);
