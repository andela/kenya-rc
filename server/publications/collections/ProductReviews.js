import { Meteor } from "meteor/meteor";
import { ProductReviews } from "/lib/collections";

Meteor.publish("ProductReviews", () => {
  return ProductReviews.find();
});
