import { Meteor } from "meteor/meteor";
import { ShopReviews } from "/lib/collections";

Meteor.publish("ShopReviews", () => {
  return ShopReviews.find();
});
