import React, { Component } from "react";
import PropTypes from "prop-types";
import { ReactionProduct } from "/lib/api";
import { ProductReviews } from "/lib/collections";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Card, CardBody } from "/imports/plugins/core/ui/client/components";

class ProductRating extends Component {
  static PropTypes = {
    reviews: PropTypes.arrayOf(PropTypes.any)
  };

  render() {
    const { reviews } = this.props;
    const totalRatings = reviews.map(review => review.rating)
      .reduce((total, rating) => total + rating, 0);
    const reviewCount = reviews.length;
    const productAverageRating = reviewCount ? Math.floor((totalRatings / reviewCount) * 100) / 100 : 0;
    return (
      <div>
        <Card className="col-md-4 col-md-offset-4 product-rating-card">
          <CardBody>
            <div className="text-center card-body">
              <span><h4 className="text-center">
                RATING
              </h4></span>
              <span><h1 className="text-center average-rating">
                { productAverageRating }
              </h1></span>
              <small className="text-muted"> Rated by {reviews.length} customer(s)</small>
            </div>
          </CardBody>
        </Card>
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
  productData(null, {
    reviews: ProductReviews.find({
      productId: ReactionProduct.selectedProductId()
    }, {
      sort: {
        createdAt: -1
      }
    }).fetch()
  });
};

registerComponent("ProductReview", ProductRating);

export default composeWithTracker(composer)(ProductRating);
