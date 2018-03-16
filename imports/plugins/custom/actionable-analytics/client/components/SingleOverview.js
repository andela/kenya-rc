import React from "react";

export const SingleOverview = props => (
  <div className="col-sm-4 single-overview">
    <table className="table table-striped table-hover table-responsive table-bordered text-center">
      <thead className="theme-color table-heading text-center">
        <tr className="line-height">
          {props.boxTitle}
        </tr>
      </thead>
      <tbody className="table-body text-center">
        <tr className="line-height">
          {props.boxValue}
        </tr>
      </tbody>
    </table>
  </div>);

export default SingleOverview;
