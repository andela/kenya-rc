import {
  Meteor
} from "meteor/meteor";
import {
  check
} from "meteor/check";
  // reaction modules
import {
  Reaction,
  Logger
} from "/server/api";
import {
  WalletApi
} from "./walletapi";
import {
  Wallets
} from "/lib/collections";

Meteor.methods({
  /**
    * Submit a card for Authorization
    * @param  {Object} transactionType authorize or capture
    * @param  {Object} cardData card Details
    * @param  {Object} paymentData The details of the Payment Needed
    * @return {Object} results normalized
  */
  walletSubmit(transactionType, cardData, paymentData) {
    check(transactionType, String);
    check(cardData, {});
    check(paymentData, {
      total: String,
      currency: String
    });
    const total = parseFloat(paymentData.total);
    let result;
    try {
      const transaction = WalletApi.methods.authorize.call({
        transactionType,
        cardData,
        paymentData
      });

      result = {
        saved: true,
        status: "created",
        currency: paymentData.currency,
        amount: total,
        riskLevel: normalizeRiskLevel(transaction),
        transactionId: transaction.id,
        response: {
          amount: total,
          transactionId: transaction.id,
          currency: paymentData.currency
        }
      };
    } catch (error) {
      Logger.warn(error);
      result = {
        saved: false,
        error
      };
    }
    return result;
  },

  /**
    * Capture a Charge
    * @param {Object} paymentData Object containing data about the transaction to capture
    * @return {Object} results normalized
  */
  "wallet/payment/capture": function (paymentData) {
    check(paymentData, Reaction.Schemas.PaymentMethod);
    const authorizationId = paymentData.transactionId;
    const amount = paymentData.amount;
    const response = WalletApi.methods.capture.call({
      authorizationId,
      amount
    });
    const result = {
      saved: true,
      response
    };
    return result;
  },

  /**
    * Create a refund
    * @param  {Object} paymentMethod object
    * @param  {Number} amount The amount to be refunded
    * @return {Object} result
  */
  "wallet/refund/create": function (paymentMethod, amount) {
    check(paymentMethod, Reaction.Schemas.PaymentMethod);
    check(amount, Number);
    const {
      transactionId
    } = paymentMethod;
    const response = WalletApi.methods.refund.call({
      transactionId,
      amount
    });
    const results = {
      saved: true,
      response
    };
    return results;
  },

  /**
    * List refunds
    * @param  {Object} paymentMethod Object containing the pertinant data
    * @return {Object} result
  */
  "wallet/refund/list": (paymentMethod) => {
    check(paymentMethod, Reaction.Schemas.PaymentMethod);
    const {
      transactionId
    } = paymentMethod;
    const response = WalletApi.methods.refunds.call({
      transactionId
    });
    const result = [];
    for (const refund of response.refunds) {
      result.push(refund);
    }

    // The results retured from the GenericAPI just so happen to look like exactly what the dashboard
    // wants. The return package should ba an array of objects that look like this
    // {
    //   type: "refund",
    //   amount: Number,
    //   created: Number: Epoch Time,
    //   currency: String,
    //   raw: Object
    // }
    const emptyResult = [];
    return emptyResult;
  },
  "wallet/getWalletDetails": (userId) => {
    check(userId, String);
    return Wallets.find({ userId }).fetch();
  },
  "wallet/update-balance": async function (transaction) {
    check(transaction, Object);
    const {
      amount,
      to,
      from,
      transactionType
    } = transaction;

    const updateBalance = (currentBalance, updateAmount, ownerEmail) => {
      try {
        Wallets.update({ ownerEmail }, {
          $set: {
            balance: currentBalance + updateAmount
          }
        });
        return "Success";
      } catch (error) {
        return "Error";
      }
    };

    let updateResult;

    if (to === from) {
      const wallet = Wallets.findOne({ ownerEmail: from });
      const currentBalance = wallet.balance;
      updateResult = updateBalance(currentBalance, amount, from);
    } else {
      if (transactionType === "credit") {
        const receiverWallet = Wallets.findOne({ ownerEmail: to });
        const currentBalance = receiverWallet.balance;
        updateResult = updateBalance(currentBalance, amount, to);
      } else {
        const senderWallet = Wallets.findOne({ ownerEmail: from });
        const currentBalance = senderWallet.balance;
        updateResult = updateBalance(currentBalance, -amount, from);
      }
    }
    return updateResult;
  }
});

/**
  * @method normalizeRiskLevel
  * @private
  * @summary Normalizes the risk level response of a transaction to the values defined in paymentMethod schema
  * @param  {object} transaction - The transaction that we need to normalize
  * @return {string} normalized status string - either elevated, high, or normal
*/
function normalizeRiskLevel(transaction) {
  // the values to be checked against will depend on the return codes/values from the payment API
  if (transaction.riskStatus === "low_risk_level") {
    return "elevated";
  }

  if (transaction.riskStatus === "highest_risk_level") {
    return "high";
  }

  // default to normal if no other flagged
  return "normal";
}
