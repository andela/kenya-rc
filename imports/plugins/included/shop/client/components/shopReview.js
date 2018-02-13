import React, { Component } from "react";
import PropTypes from "prop-types";
import { Reaction } from "/client/api";
import { Meteor } from "meteor/meteor";
import { Reviews } from "/lib/collections";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import ShopRating from "./shopRating";
import DisplayReviews from "./../../../product-detail-simple/client/components/displayReviews";

class ShopReview extends Component {
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
  createReview = () => {
    const shopId = Reaction.getShopId();
    // eslint-disable-next-line
    const thisComponent = this;
    if (this.state.rating === 0) {
      Alerts.toast("Please add a rating to your review.", "error");
      return;
    }
    Meteor.call("shopReview/createReview",
      shopId,
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

  onRatingChange = rating => this.setState({ rating });

  onInputChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  render() {
    return (
      <div className="view-review-container">
        <h2 className="text-center shop-name">{Reaction.getShopName()}</h2>
        <ShopRating />
        <DisplayReviews
          containerClasses="col-md-5 col-md-offset-1"
          reviews={this.props.reviews}
          onRatingChange={this.onRatingChange}
          user={this.state.user}
          createReview={this.createReview}
          review={this.state.review}
          onInputChange={this.onInputChange}
          reviewType="Shop"
          rating={this.state.rating}
        />
      </div>
    );
  }
}
ShopReview.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    review: PropTypes.string
  }))
};

ShopReview.defaultProps = {
  reviews: []
};
function composer(props, shopData) {
  const shopId = Reaction.Router.getQueryParam("_");
  shopData(null, {
    reviews: Reviews.find(
      { shopId }, { sort: { createdAt: -1 }, limit: 1000 }).fetch()
  });
}

registerComponent("ShopReview", ShopReview);

export default composeWithTracker(composer)(ShopReview);
