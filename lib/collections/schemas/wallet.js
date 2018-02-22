import { SimpleSchema } from "meteor/aldeed:simple-schema";

/**
 * Wallet Schema
 */

export const Wallet = new SimpleSchema({
  userId: {
    type: String,
    label: "User"
  },
  transactions: {
    type: String,
    optional: true
  },
  balance: {
    type: Number,
    decimal: true,
    defaultValue: 0,
    optional: true
  }
});
