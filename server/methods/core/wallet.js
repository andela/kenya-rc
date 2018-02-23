import { Wallets } from "/lib/collections";
import { check } from "meteor/check";

/* eslint-disable no-undef*/

Meteor.methods({
  "wallet/transaction": (userId, transactions) => {
    check(userId, String);
    check(transactions, Object);
    let balanceOptions;
    const { amount, transactionType } = transactions;
    if (transactionType === "Credit") {
      balanceOptions = { balance: amount };
    }
    if (transactionType === "Debit") {
      balanceOptions = { balance: -amount };
    }

    try {
      Wallets.update({ userId }, {  $inc: balanceOptions }, { upsert: true });
      return 1;
    } catch (error) {
      return 0;
    }
  }
});
