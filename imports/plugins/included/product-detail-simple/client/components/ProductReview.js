import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactStars from "react-stars";
import { Meteor } from "meteor/meteor";
import { ReactionProduct } from "/lib/api";
import { ProductReviews } from "/lib/collections";
import { Card, CardHeader, CardBody, ReactionAvatar } from "/imports/plugins/core/ui/client/components";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

class ProductReview extends Component {
  static PropTypes = {
    reviews: PropTypes.arrayOf(PropTypes.any);
  };
  constructor(props) {
    this.state = {
      review: "",
      rating: 0,
      user: Meteor.user()
    };
  };

  createReview = () => {
    const thisComponent = this;
    if (this.state.rating === 0) {
      Alerts.toast("You need to provide a rating for your review", "error");
      return;
    };
    Meteor.call("ProductReview/createReview", ReactionProduct.selectedProductId(), this.state.review, this.state.rating, (error) => {
      if (error) {
        Alerts.toast(error.reason, "error");
      } else {
        thisComponent.setState({ review: "", rating: 0 });

        Alerts.toast("Product Review Successful!", "success");
      }
    });
  };

  render() {
    const { reviews } = this.props;
    const totalReviews = reviews.map(review => (
      <div className="media" key={review._id}>
        <div className="media-left" style={{ paddingRight: "39px" }}>
          <ReactionAvatar
            size={40}
            style={{ marginTop: 5 }}
            className={"img-responsive"}
            email={"billmike1994@gmail.com"}
            name={"Bill Michael"}
            round
          />
        </div>
        <div className="media-body">
          <h4 className="media-hearing" style={{ marginBottom: "12px" }}>
            <ReactStars
              edit={false}
              onChange={rating => { this.setState({ rating }); }}
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
      <div style={{ marginTop: "10px" }}>
        <Card>
          <CardHeader i18nKeyTitle={"Product reviews"} title={"Product reviews"}>
            <CardBody>
              {this.state.user.emails.length > 0 &&
              <div className="row" style={{ padding: "5px" }}>
                <div className="media">
                  <div className="media-left" style={{ paddingRight: "39px" }}>
                    <ReactionAvatar
                      size={40}
                      style={{ marginTop: 5 }}
                      className={"img-responsive"}
                      email={this.state.user.emails[0].address}
                      name={"Bill Michael"}
                      round
                    />
                  </div>
                  <div className="media-body">
                    <h4 className="media-hearing" style={{ marginBottom: "12px" }}>
                      <ReactStars
                        onChange={rating => this.setState({ rating });}
                        count={5}
                        size={18}
                        value={this.state.rating}
                      />
                    </h4>
                    <textarea style={{ border: "2px solid #5cde86", boxShadow: "none", marginBottom: "4px" }} placeholder="Provide a review for this product...." cols="2" rows="2"
                      className="form-control"
                      value={this.state.review}
                      name="review"
                      onChange={event => { this.setState({ [event.target.name]: event.target.value }); }}
                    />
                    <div className="add-to-cart">
                      <button
                      className="btn pull-right"
                      onClick={this.createReview}
                      disabled={this.state.review.length < 8}
                      style={{ backgroundColor: "#5cde86", borderRadius: "0 2px 2px 0", color: "#ffffff" }}
                      >Submit review</button>
                    </div>
                  </div>
                </div>
              </div>
              }
              {
              this.state.user.emails.length < 1 &&
              <p className="text-center">You need to be signed in to provide a review.</p>
            }
            <div className="review-container" style={{ overflowY: "auto", height: "350px" }}>
              {reviewList}
            </div>
            </CardBody>
          </CardHeader>
        </Card>
      </div>
    );
  }
};

const composer = (props, productData) => {
  onData(null, {
    reviews: ProductReviews.find({ productId: ReactionProduct.selectedProductId() }, { sort: { createdAt: -1 }, limit: 20 }).fetch()
  });
};

registerComponent("ProductReview", ProductReview);

export default composeWithTracker(composer)(ProductReview);
