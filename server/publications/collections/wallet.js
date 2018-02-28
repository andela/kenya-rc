import { Wallets } from "/lib/collections";

/* eslint-disable no-undef */

Meteor.publish("myTransactions", (userId) => {
  check(userId, String);
  return Wallets.find({ userId });
});
