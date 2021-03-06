import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { shopIdAutoValue } from "./helpers";
import { registerSchema } from "@reactioncommerce/reaction-collections";

export const Reviews = new SimpleSchema({
  _id: {
    type: String,
    label: "Review Id"
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  email: {
    type: String
  },
  name: {
    type: String,
    optional: true,
    defaultValue: ""
  },
  productId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  shopId: {
    type: String,
    autoValue: shopIdAutoValue,
    regEx: SimpleSchema.RegEx.Id,
    index: 1,
    optional: true
  },
  review: {
    type: String,
    label: "Review",
    max: 255
  },
  rating: {
    type: Number,
    label: "Rating",
    defaultValue: 0,
    min: 0,
    max: 5,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    }
  },
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return {
          $set: new Date
        };
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    },
    optional: true
  }
});

registerSchema("Reviews", Reviews);
