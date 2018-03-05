import React from "react";
import _ from "lodash";
import { registerComponent } from "@reactioncommerce/reaction-components";
import { SideMenu } from "../components/SideMenu";
import { RetailDashBoard } from "../components/RetailDashBoard";
import { SalesOverview } from "../components/SalesOverview";
import { InventoryOverview } from "../components/InventoryOverview";
import { ProductStatistics } from "../components/ProductStatistics";
import { analyseOrder } from "../helpers/orderAnalytics";
import { getAverageSales } from "../helpers/averageSales";
import { Meteor } from "meteor/meteor";
import { SelectDate } from "../components/Date";

/**
 * @export
 * @class ActionableAnalyticsContainer
 * @extends {React.Component}
 */
class ActionableAnalyticsContainer extends React.Component {
    state = {
      value: "allProduct",
      statValue: "quantity",
      ordersPlaced: 0,
      ordersData: [],
      beforeDate: new Date(),
      afterDate: new Date(),
      totalSales: 0,
      totalItemsPurchased: 0,
      ordersCancelled: 0,
      totalShippingCost: 0,
      salesPerDay: 0,
      analytics: {},
      analyticsStatement: {},
      ordersAnalytics: [],
      productsAnalytics: [],
      fromDate: Date.parse("2017-10-13"),
      toDate: Date.now(),
      dateIsChange: false,
      productInventoryData: [],
      productSearchTerm: "",
      headingText: "Retail DashBoard",
      grossProfit: 0,
      productStatSearchTerm: "",
      selectedTab: "tab1"
    };

    componentDidMount() {
      this.getAnalytics(this.state.fromDate, this.state.toDate);
    }

    componentDidUpdate() {
      if (this.state.dateIsChange) {
        this.getAnalytics(this.state.fromDate, this.state.toDate);
      }
    }
  /**
   * @memberof ActionableAnalyticsContainer
   * @description it fetches orders by date
   *
   * @param {date} fromDate
   * @param {date} toDate
   * @returns {object} product analysis
   */
  getAnalytics = (fromDate, toDate) => {
    Meteor.call("getOrders",
      {
        fromDate: fromDate,
        toDate: toDate
      },
      (errors, ordersFetched) => {
        if (errors) {
          return errors;
        }
        if (ordersFetched) {
          const analyticsItems = analyseOrder(ordersFetched, fromDate, toDate);
          this.setState({
            dateIsChange: false,
            ordersData: ordersFetched,
            ordersPlaced: ordersFetched.length,
            totalSales: analyticsItems.totalSales,
            totalItemsPurchased: analyticsItems.totalItemsPurchased,
            totalShippingCost: analyticsItems.totalShippingCost,
            analytics: analyticsItems.analytics,
            ordersAnalytics: analyticsItems.ordersAnalytics,
            ordersCancelled: analyticsItems.ordersCancelled,
            grossProfit: (analyticsItems.totalSales -
              analyticsItems.totalCostPrice)
          });
          this.setState({
            salesPerDay:
            getAverageSales(this.state.totalSales, fromDate, toDate)
          });
        }
      });
  }

  getProductInventoryData = (searchTerm) => {
    Meteor.call("getProductInventoryData",
      {
        searchTerm: searchTerm
      }, (errors, fetchedProductInventoryData) => {
        if (errors) {
          return errors;
        }
        this.setState({
          productInventoryData: fetchedProductInventoryData
        });
      });
  }
  /**
   * @memberof ActionableAnalyticsContainer
   * @param {object} event
   * @returns {void}
   */
  handleShowRetailDashBoard = () => {
    this.setState({
      headingText: "Retail DashBoard",
      selectedTab: "tab1"
    });
  }
  /**
 * @memberof ActionableAnalyticsContainer
 * @param {object} event
 * @returns {void}
 */
  handleShowSalesOverview = () => {
    this.setState({
      headingText: "Sales Overview",
      selectedTab: "tab2"
    });
  }
  /**
   * @memberof ActionableAnalyticsContainer
   * @param {object} event
   * @returns {void}
   */
  handleShowInventoryOverview = () => {
    this.setState({
      headingText: "Inventory Overview",
      selectedTab: "tab3"
    });
  }
  /**
 * @memberof ActionableAnalyticsContainer
 * @param {object} event
 * @returns {void}
 */
  handleShowProductStatistics = () => {
    this.setState({
      headingText: "Products Statistics",
      selectedTab: "tab4"
    });
    console.log(this.state);
  }
  /**
   * @memberof ActionableAnalyticsContainer
   * @param {object} event
   * @returns {void}
   */
  handleToDateInputChange = (event) => {
    if (!_.isEmpty(event.target.value)) {
      this.setState({
        toDate: Date.parse(event.target.value),
        dateIsChange: true
      });
    }
  }
  /**
   * @memberof ActionableAnalyticsContainer
   * @param {object} event
   * @returns {void}
   */
  handleFromDateInputChange = (event) => {
    if (!_.isEmpty(event.target.value)) {
      this.setState({
        fromDate: Date.parse(event.target.value),
        dateIsChange: true
      });
    }
  }
  /**
   * @memberof ActionableAnalyticsContainer
   * @param {object} event
   * @returns {void}
   */
  handleProductTypeChange = (event) => {
    this.setState({
      value: event.target.value
    });
  }
  /**
   * @memberof ActionableAnalyticsContainer
   * @param {object} event
   * @returns {void}
   */
  handleOptionChange = (event) => {
    this.setState({
      statValue: event.target.value
    });
  }
  /**
   * @memberof ActionableAnalyticsContainer
   * @param {object} event
   * @returns {void}
   */
  handleInventoryInputChange = (event) => {
    this.getProductInventoryData(event.target.value);
  }
  /**
 * @memberof ActionableAnalyticsContainer
 * @param {object} event
 * @returns {void}
 */
  handleSalesInputChange = (event) => {
    this.setState({
      productSearchTerm: event.target.value
    });
  }
  /**
 * @memberof ActionableAnalyticsContainer
 * @param {object} event
 * @returns {void}
 */
  handleProductStatInputChange = (event) => {
    this.setState({
      productStatSearchTerm: event.target.value
    });
  }
  render() {
    return (
      <div className="container-fluid">
        <SideMenu
          handleShowRetailDashBoard={this.handleShowRetailDashBoard}
          handleShowSalesOverview={this.handleShowSalesOverview}
          handleShowInventoryOverview={this.handleShowInventoryOverview}
          handleShowProductStatistics={this.handleShowProductStatistics}
        />
        <div className="row justify-content-center">
          <div
            className=
              "col-sm-4 col-md-4 col-md-offset-1 col-lg-4 col-lg-offset-1"
          >
            <h3>{this.state.headingText}</h3>
          </div>

          <div className="row text-center">

            <SelectDate
              handleInputChange={this.handleFromDateInputChange}
              sideLabel="FROM"
              dateClass="col-sm-3 report-date from-date"
              inputName="from-date-input"
            />
            <SelectDate
              handleInputChange={this.handleToDateInputChange}
              sideLabel="TO"
              dateClass="col-sm-3 report-date"
              inputName="to-date-input"
            />
          </div>
        </div>

        <RetailDashBoard
          OrdersData={this.state}
        />
        <SalesOverview
          selectedTab={this.state.selectedTab}
          productSearchTerm={this.state.productSearchTerm}
          productSalesData={this.state.analytics}
          handleSalesInputChange={this.handleSalesInputChange}
        />
        <InventoryOverview
          selectedTab={this.state.selectedTab}
          productInventoryData={this.state.productInventoryData}
          handleInventoryInputChange={this.handleInventoryInputChange}
        />
        <ProductStatistics
          selectedTab={this.state.selectedTab}
          salesData={this.state.analytics}
          handleProductTypeChange={this.handleProductTypeChange}
          handleOptionChange={this.handleOptionChange}
          handleProductStatInputChange={this.handleProductStatInputChange}
          statValue={this.state.statValue}
          filterValue={this.state.value}
          productStatSearchTerm={this.state.productStatSearchTerm}
        />
      </div>
    );
  }
}
registerComponent("ActionableAnalyticsContainer", ActionableAnalyticsContainer);
export default ActionableAnalyticsContainer;

