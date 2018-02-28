import React from "react";
import PropTypes from "prop-types";

const CancelOderButton = ({ cancelOrder, order }) => {
  return (
    <div>
      {
        order.workflow.status !== "coreOrderWorkflow/canceled" &&
        (
          <div>
            <button
              className="btn btn-danger btn-block"
              onClick={cancelOrder}
            >
              Cancel Order
            </button>
          </div>
        )
      }
    </div>
  );
};

CancelOderButton.propTypes = {
  cancelOrder: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired
};

export default CancelOderButton;
