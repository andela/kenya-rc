import React from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import { formatPriceString } from "/client/api";
import { SingleOverview } from "../components/SingleOverview";

export const RetailDashBoard = (props) => {
  const { OrdersData } = props;
  const {
    totalSales,
    ordersCancelled,
    ordersPlaced,
    totalItemsPurchased
  } = OrdersData;
  return (
    <div
      id="tab1"
      style={{ display: OrdersData.selectedTab === "tab1" ? "block" : "none" }}
      className="col-sm-12 col-md-offset-2 col-lg-8 col-lg-offset-3 fade in active text-center"
    >
      <SingleOverview
        boxTitle="REVENUE"
        boxValue={formatPriceString(totalSales)}
      />
      <SingleOverview
        boxTitle="CANCELLED ORDERS"
        boxValue={ordersCancelled}
      />
      <SingleOverview
        boxTitle="PLACED ORDERS"
        boxValue={ordersPlaced}
      />
      <SingleOverview
        boxTitle="PURCHASED ITEMS"
        boxValue={totalItemsPurchased}
      />
    </div>
  );
};
registerComponent("RetailDashBoard", RetailDashBoard);
export default RetailDashBoard;
