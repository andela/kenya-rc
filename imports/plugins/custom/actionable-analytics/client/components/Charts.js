import React from "react";
import _ from "lodash";
import { BarChart, XAxis, YAxis, Legend, CartesianGrid, Tooltip, Bar } from "recharts";

export const Chart = (props) => {
  const {
    fetchedData,
    statValue,
    productStatSearchTerm,
    filterValue
  } = props;
  const mappedData = [];
  let sortedData = [];
  let filteredData = [];
  const allProductArray = [];
  const searchTerm = new RegExp(productStatSearchTerm.toLowerCase());
  _.map(fetchedData, (items, key) => {
    if (key.toLowerCase().match(searchTerm) || searchTerm.length === 0) {
      allProductArray.push({
        name: key,
        quantity: items.quantitySold,
        customers: items.customerCount,
        sales: items.totalSales,
        average: items.averageSalesPerDay,
        totalProfit: items.totalProfit,
        productType: items.productType
      });
    }
    if (mappedData.length < 5 && key.toLowerCase().match(searchTerm) &&
      searchTerm.length !== 0) {
      mappedData.push({
        name: key,
        quantity: items.quantitySold,
        customers: items.customerCount,
        sales: items.totalSales,
        average: items.averageSalesPerDay,
        totalProfit: items.totalProfit,
        productType: items.productType
      });
    } else if (mappedData.length < 5 && searchTerm.length === 0) {
      mappedData.push({
        name: key,
        quantity: items.quantitySold,
        customers: items.customerCount,
        sales: items.totalSales,
        average: items.averageSalesPerDay,
        totalProfit: items.totalProfit,
        productType: items.productType
      });
    }
  });
  sortedData = _.sortBy(mappedData, [statValue]);
  filteredData = _.filter(allProductArray, ["productType", filterValue]);
  return (
    <div className="row container">
      <div className="col-sm-8 col-md-8 col-md-offset-1" id="Bar">
        <BarChart
          width={800}
          height={400}
          data={filterValue === "allProduct" ? sortedData : filteredData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {
            statValue === "quantity" &&
            <Bar dataKey="quantity" fill="#8884d8"/>
          }
          {
            statValue === "customers" &&
            <Bar dataKey="customers" fill="#82ca9d" />
          }
          {
            statValue === "sales" &&
            <Bar dataKey="sales" fill="#01c8ff" />
          }
          {
            statValue === "average" &&
            <Bar dataKey="average" fill="darksalmon" />
          }
        </BarChart>
      </div>
    </div>
  );
};
export default Chart;
