import React from "react";

import { registerComponent } from "@reactioncommerce/reaction-components";
import { Search } from "../components/Search";
import { InventoryTable } from "../components/InventoryTable";

export const InventoryOverview = ({ productInventoryData, selectedTab, handleInventoryInputChange }) => (
  <div
    id="tab3"
    style={{ display: selectedTab === "tab3" ? "block" : "none" }}
    className="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1 tabBox tab-pane fade"
  >
    <div className="container-fluid">
      <div className="row">
        <Search
          inputName="inventorySearchInput"
          inputPlaceholder="Type product name"
          handleInputChange={handleInventoryInputChange}
          inputClass="col-sm-4 col-sm-offset-6"
        />
      </div>
    </div>
    <div className="card container col-lg-offset-1">
      <InventoryTable
        tableHeadingArray={[
          "Product",
          "Weight",
          "Quantity",
          "Price",
          "Country of origin"
        ]}
        fetchedTableData={productInventoryData}
      />
    </div>
  </div>
);
registerComponent("InventoryOverview", InventoryOverview);

export default InventoryOverview;
