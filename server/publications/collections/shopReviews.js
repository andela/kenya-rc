import { Meteor } from "meteor/meteor";
import { Reviews } from "/lib/collections";

Meteor.publish("Reviews", () => {
  return Reviews.find();
});
