import {
  Meteor
} from "meteor/meteor";
import {
  Packages
} from "/lib/collections";

export const Wallet = {
  accountOptions() {
    const {
      settings
    } = Packages.findOne({
      name: "reaction-paymentmethod"
    });
    if (!settings.apiKey) {
      throw new Meteor.Error("403", "Invalid Credentials");
    }
    return settings.apiKey;
  },

  authorize(cardInfo, paymentInfo, callback) {
    Meteor.call("walletSubmit", "authorize", cardInfo, paymentInfo, callback);
  }
};
