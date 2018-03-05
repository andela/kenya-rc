import React from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";

export const SideMenu = props => (
  <div className="col-sm-12 col-md-12 col-lg-1">
    <ul className="nav nav-pills">
      <li className="active respon">
        <a
          data-toggle="tab"
          role="presentation"
          onClick={props.handleShowRetailDashBoard}
          className="responsive"
          href="#tab1"
        ><strong>RETAIL DASHBOARD</strong>
        </a>
      </li>
      <li className="respon">
        <a
          data-toggle="tab"
          role="presentation"
          onClick={props.handleShowSalesOverview}
          className="responsive"
          href="#tab2"
        >
          <strong>SALES OVERVIEW</strong>
        </a>
      </li>
      <li className="respon">
        <a
          data-toggle="tab"
          role="presentation"
          onClick={props.handleShowInventoryOverview}
          className="responsive"
          href="#tab3"
        >
          <strong>INVENTORY</strong>
        </a>
      </li>
      <li className="respon">
        <a
          data-toggle="tab"
          role="presentation"
          onClick={props.handleShowProductStatistics}
          className="responsive"
          href="#tab4"
        ><strong>PRODUCT STATISTICS</strong>
        </a>
      </li>
    </ul>
  </div>
);

registerComponent("SideMenu", SideMenu);
export default SideMenu;
