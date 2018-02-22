import { WalletSettingsFormContainer } from "../containers";
import { Template } from "meteor/templating";
import "./wallet.html";

Template.walletSettings.helpers({
  WalletSettings() {
    return {
      component: WalletSettingsFormContainer
    };
  }
});
