import React, { Component } from "react";
import PropTypes from "prop-types";
import { Components, registerComponent } from "@reactioncommerce/reaction-components";
import { Card, CardBody } from "/imports/plugins/core/ui/client/components";
import "./priceRange.less";

class AddToCartButton extends Component {
  get hasVariants() {
    return Array.isArray(this.props.variants) && this.props.variants.length > 0;
  }

  handleCartQuantityChange = (event) => {
    if (this.props.onCartQuantityChange) {
      this.props.onCartQuantityChange(event, event.target.value);
    }
  }

  render() {
    const URL = window.location.href;
    if (this.hasVariants) {
      return (
        <div className="row">
          <div className="pdp add-to-cart block">
            <input
              className="form-control input-md"
              id="add-to-cart-quantity"
              min="1"
              name="addToCartQty"
              onChange={this.handleCartQuantityChange}
              type="number"
              value={this.props.cartQuantity}
            />
            <button
              className="input-group-addon add-to-cart-text js-add-to-cart"
              data-i18n="productDetail.addToCart"
              onClick={this.props.onClick || this.props.onAddToCart}
            >
              <Components.Translation defaultValue="Add to cart" i18nKey="productDetail.addToCart" />
            </button>
          </div>
          <Card className="col-md-12 product-rating-card">
            <CardBody>
              <div className="text-center card-body">
                <span>
                  <h4 className="text-center">
                    Share on social media
                  </h4>
                </span>
                <a className="fa fa-twitter"
                  href={`https://twitter.com/intent/tweet?&url=${URL}&hashtags=KenyaRc`}
                  data-size="large"
                  target="_blank"
                />
                <a className="fa fa-facebook"
                  href={`https://www.facebook.com/sharer/sharer.php?url=${URL}`}
                  target="_blank"
                  data-size="large"
                />
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    if (this.props.editable && this.hasVariants === false) {
      return (
        <Components.Alert>
          <Components.Translation defaultValue="Add options to enable 'Add to Cart' button" i18nkey="productVariant.addVariantOptions" />
        </Components.Alert>
      );
    }
    return null;
  }
}

AddToCartButton.propTypes = {
  cartQuantity: PropTypes.number,
  editable: PropTypes.bool,
  onAddToCart: PropTypes.func,
  onCartQuantityChange: PropTypes.func,
  onClick: PropTypes.func,
  variants: PropTypes.arrayOf(PropTypes.object)
};

registerComponent("AddToCartButton", AddToCartButton);

export default AddToCartButton;
