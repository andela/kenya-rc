import React from "react";

import { registerComponent } from "@reactioncommerce/reaction-components";
import { Search } from "../components/Search";
import { SalesTable } from "./SalesTable";

export const SalesOverview = (props) => {
  const {
    productSalesData,
    selectedTab,
    handleSalesInputChange,
    productSearchTerm
  } = props;
  return (
    <div
      id="tab2"
      style={{ display: selectedTab === "tab2" ? "block" : "none" }}
      className="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1 tabBox tab-pane fade"
    >
      <div className="container-fluid">
        <div className="row">
          <Search
            inputName="inventorySearchInput"
            inputPlaceholder="Type product name"
            handleInputChange={handleSalesInputChange}
            inputClass="col-sm-4 col-sm-offset-6"
          />
        </div>
      </div>
      <div className="card container col-lg-offset-1">
        <SalesTable
          tableHeadingArray={[
            "Product Name",
            "Quantity Sold",
            "Total Sales",
            "First Sale",
            "Last Sale",
            "Customer Count",
            "Average Sales per Day"
          ]}
          productSearchTerm={productSearchTerm}
          fetchedTableData={productSalesData}
        />
      </div>
    </div>
  );
};
registerComponent("SalesOverview", SalesOverview);

export default SalesOverview;
