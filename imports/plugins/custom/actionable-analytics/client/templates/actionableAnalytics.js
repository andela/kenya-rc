import { Template } from "meteor/templating";
import "./actionableAnalytics.html";
import { ActionableAnalyticsContainer } from "../containers";

Template.actionableAnalytics.helpers({
  ActionableAnalytics() {
    return {
      component: ActionableAnalyticsContainer
    };
  }
});
