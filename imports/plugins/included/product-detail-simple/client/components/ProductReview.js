import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { ReactionProduct } from "/lib/api";
import { Reviews } from "/lib/collections";
import DisplayReviews from "./displayReviews";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

class ProductReview extends Component {
  static propTypes = {
    reviews: PropTypes.arrayOf(PropTypes.any)
  };
  constructor(props) {
    super(props);
    this.state = {
      review: "",
      rating: 0,
      user: Meteor.user()
    };
  }

  onRatingChange = rating => this.setState({ rating });

  onInputChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  createReview = () => {
    const productId = ReactionProduct.selectedProductId();
    // eslint-disable-next-line
    const thisComponent = this;
    if (this.state.rating === 0) {
      Alerts.toast("Please add a rating to your review.", "error");
      return;
    }
    Meteor.call("productReview/createReview",
      productId,
      this.state.review,
      this.state.rating,
      function (error) {
        if (error) {
          // Alert to the user that something went wrong.
          Alerts.toast(error.reason, "error");
        } else {
          thisComponent.setState({ review: "", rating: 0 });
          //  Alert to the user that the review was created.
          Alerts.toast("Review published !", "success");
        }
      });
  }

  render() {
    return (
      <div className="view-review-container">
        <DisplayReviews
          reviews={this.props.reviews}
          onRatingChange={this.onRatingChange}
          user={this.state.user}
          createReview={this.createReview}
          review={this.state.review}
          onInputChange={this.onInputChange}
          reviewType="Product"
          rating={this.state.rating}
        />
      </div>
    );
  }
}
ProductReview.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    review: PropTypes.string
  }))
};

ProductReview.defaultProps = {
  reviews: []
};
function composer(props, productData) {
  const productId = ReactionProduct.selectedProductId();
  productData(null, {
    reviews: Reviews.find(
      { productId },
      { sort: { createdAt: -1 }, limit: 1000 }).fetch()
  });
}

registerComponent("ProductReview", ProductReview);

export default composeWithTracker(composer)(ProductReview);
