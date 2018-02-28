import {
  Meteor
} from "meteor/meteor";
import {
  Template
} from "meteor/templating";
import {
  Accounts,
  Wallets
} from "/lib/collections";
import verifyPayment from "./verifyPayment";

let paystackKeys = {};

Template.wallet.onCreated(function bodyOnCreated() {
  /* eslint-disable no-undef */
  this.state = new ReactiveDict();
  this.state.setDefault({
    details: {
      balance: 0
    }
  });
  this.autorun(() => {
    this.subscribe("myTransactions", Meteor.userId());
    const transactionInfo = Wallets.find().fetch();
    if (transactionInfo.length > 0) {
      this.state.set("details", transactionInfo[0]);
    }
  });
});

const finalizeDeposit = (paystackMethod) => {
  Meteor.call(
    "wallet/transaction",
    Meteor.userId(),
    paystackMethod.transactions,
    (err, res) => {
      if (res) {
        Alerts.toast("Your deposit was successful", "success");
      } else {
        Alerts.toast("A error occured, please try again", "error");
      }
    }
  );
};

/**
 * @returns {funct} handleDepositPayment
 * @param {void} result
 */

Template.wallet.events({

  "submit #deposit": (event) => {
    event.preventDefault();
    const accountDetails = Accounts.find(Meteor.userId()).fetch();
    const userMail = accountDetails[0].emails[0].address;
    const amount = parseInt(document.getElementById("depositAmount").value, 10);
    if (amount <= 0 || !amount) {
      Alerts.toast("Please enter a deposit amount greater than zero ", "error");
      return false;
    }

    Meteor.call("paystack/loadApiKeys", (err, keys) => {
      if (err) {
        Alerts.toast("There was an error processing your request ", "error");
        return false;
      }
      paystackKeys = keys;
      const handler = PaystackPop.setup({
        key: keys.publicKey,
        email: userMail,
        amount: amount * 100,
        callback: (result) => {
          const type = "deposit";
          const transactionRef = result.reference;
          if (transactionRef) {
            verifyPayment(transactionRef, paystackKeys.secretKey, (error, response) => {
              if (error) {
                Alerts.toast("Unable to verify payment", "error");
              } else if (response.data.status !== "success") {
                Alerts.toast("Payment was unsuccessful", "error");
              } else {
                const paystackResponse = response.data;
                const paystackMethod = {
                  processor: "Paystack",
                  storedCard: paystackResponse.authorization.last4,
                  method: "Paystack",
                  transactionId: paystackResponse.reference,
                  currency: paystackResponse.currency,
                  amount: parseInt(paystackResponse.amount, 10),
                  status: paystackResponse.status,
                  mode: "authorize",
                  createdAt: new Date()
                };
                if (type === "deposit") {
                  paystackMethod.transactions = {
                    amount: (paystackResponse.amount) / 100,
                    referenceId: paystackResponse.reference,
                    date: new Date(),
                    transactionType: "Credit"
                  };
                  finalizeDeposit(paystackMethod);
                }
              }
            });
          }
        }
      });
      return handler.openIframe();
    });
  }
});

Template.wallet.helpers({
  balance() {
    return Template.instance().state.get("details").balance;
  }
});
