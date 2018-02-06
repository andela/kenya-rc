import React, { Component } from "react";
import PropTypes from "prop-types";
import { Reaction } from "/client/api";
import ReactStars from "react-stars";
import { Meteor } from "meteor/meteor";
import { ShopReviews } from "/lib/collections";
import { Card, CardHeader, CardBody, ReactionAvatar } from "/imports/plugins/core/ui/client/components";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import ShopRating from "./shopRating";

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
  render() {
    const { reviews } = this.props;
    const reviewList = reviews.map(review => (
      <div className="media" key={review._id}>
        <div className="media-left">
          <ReactionAvatar
            size={40}
            className={"img-responsive "}
            email={this.state.user.emails[0].address}
            name={this.state.user.name}
            round
          />
        </div>
        <div className="media-body">
          <h4 className="media-heading">
            <ReactStars
              edit={false}
              onChange={
                rating => {
                  this.setState({ rating });
                }}
              count={5}
              size={18}
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
      <div className="view-review-container">
        <h2 className="text-center shop-name">{Reaction.getShopName()}</h2>
        <Card className="col-md-3 col-md-offset-2" >
          <CardBody>
            <ShopRating />
          </CardBody>
        </Card>
        <Card className="col-md-5 col-md-offset-1">
          <CardHeader i18nKeyTitle={"Shop reviews"} title={"Shop Reviews"} />
          <CardBody >
            {
              this.state.user.emails.length > 0 &&

              <div className="row media-container">
                <div className="media">
                  <div className="media-left">
                    <ReactionAvatar
                      size={40}
                      className={"img-responsive review-avatar"}
                      email={this.state.user.emails[0].address}
                      name={this.state.user.name}
                      round
                    />
                  </div>
                  <div className="media-body">
                    <h4 className="media-heading">
                      <ReactStars
                        onChange={
                          rating => {
                            this.setState({ rating });
                          }}
                        count={5} size={18} value={this.state.rating}
                      />
                    </h4>
                    <textarea placeholder="Leave a review ..." cols="2" rows="2"
                      className="form-control review-text"
                      value={this.state.review}
                      name="review"
                      onChange={
                        event => {
                          this.setState({
                            [event.target.name]: event.target.value
                          });
                        }}
                    />
                    <div className="add-to-cart">
                      <button
                        className="btn pull-right cart-button"
                        onClick={this.createReview}
                        disabled={this.state.review.length < 8}
                      >Submit review</button>
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              this.state.user.emails.length < 1 &&
              <p className="text-center">Please sign in to add a review</p>
            }
            <div className="review-container">
              {reviewList}
            </div>
          </CardBody>
        </Card>
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
    reviews: ShopReviews.find(
      { shopId }, { sort: { createdAt: -1 }, limit: 20 }).fetch()
  });
}

registerComponent("ShopReview", ShopReview);

export default composeWithTracker(composer)(ShopReview);
