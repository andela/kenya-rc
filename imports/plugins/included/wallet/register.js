import {
  Reaction
} from "/server/api";

Reaction.registerPackage({
  label: "WalletPayment",
  name: "wallet-paymentmethod",
  icon: "fa fa-credit-card-alt",
  autoEnable: true,
  settings: {
    "mode": false,
    "apiKey": "",
    "wallet": {
      enabled: false
    },
    "wallet-paymentmethod": {
      enabled: false,
      support: [
        "Authorize",
        "Capture",
        "Refund"
      ]
    }
  },
  registry: [
    // Settings panel
    {
      label: "Wallet Payment", // this key (minus spaces) is used for translations
      provides: ["paymentSettings"],
      container: "dashboard",
      template: "walletSettings"
    },

    // Payment form for checkout
    {
      template: "walletPaymentForm",
      provides: ["paymentMethod"],
      icon: "fa fa-credit-card-alt"
    },

    // Wallet dashboard
    {
      name: "wallet",
      template: "wallet",
      route: "/wallet"
    }
  ]
});
