import React from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import { Chart } from "./Charts";
import { DisplayOption } from "../components/Options";
import { Search } from "../components/Search";

export const ProductStatistics = (props) => {
  const {
    salesData,
    selectedTab,
    handleProductTypeChange,
    handleOptionChange,
    statValue,
    handleProductStatInputChange,
    productStatSearchTerm,
    filterValue
  } = props;
  return (
    <div
      id="tab4"
      style={{ display: selectedTab === "tab4" ? "block" : "none" }}
      className="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1 tabBox tab-pane fade"
    >
      <div className="container" />
      <div className="row">
        <DisplayOption
          handleOptionChange={handleOptionChange}
          firstValue="quantity"
          secondValue="customers"
          thirdValue="sales"
          fourthValue="average"
          firstOption="Quantity Sold"
          secondOption="Customer Count"
          thirdOption="Total Sales"
          fourthOption="Average Sales"
          chartClass="col-md-3 col-md-offset-3"
        />

        <Search
          inputName="productSearchInput"
          inputPlaceholder="Type product name"
          handleInputChange={handleProductStatInputChange}
          inputClass="col-md-3"
        />
      </div>
      <Chart
        fetchedData={salesData}
        statValue={statValue}
        filterValue={filterValue}
        productStatSearchTerm={productStatSearchTerm}
      />
    </div>
  );
};
registerComponent("ProductStatistics", ProductStatistics);

export default ProductStatistics;
