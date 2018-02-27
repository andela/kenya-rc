import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Components } from "@reactioncommerce/reaction-components";
import CompletedShopOrders from "./completedShopOrders";
import CompletedOrderPaymentMethod from "./completedOrderPaymentMethods";
import CompletedOrderSummary from "./completedOrderSummary";
import CancelOrderButton from "./CancelOrderButton";
import AddEmail from "./addEmail";

/**
 * @summary Displays a summary/information about the order the user has just completed
 * @param {Object} props - React PropTypes
 * @property {Object} order - An object representing the order
 * @property {String} orderID - the unique identifier of the order
 * @property {Array} shops - An Array contains information broken down by shop
 * @property {Object} orderSummary - An object containing the items making up the order summary
 * @property {Array} paymentMethod - An array of paymentMethod objects
 * @property {Function} handleDisplayMedia - A function for displaying the product image
 * @property {Booleam} isProfilePage - A boolean value that checks if current page is user profile page
 * @return {Node} React node containing the top-level component for displaying the completed order/receipt page
 */
class CompletedOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: props.order,
      orderId: props.orderId,
      shops: props.shops,
      orderSummary: props.orderSummary,
      paymentMethods: props.paymentMethods,
      handleDisplayMedia: props.handleDisplayMedia,
      isProfilePage: props.isProfilePage,
      isCancelled: false
    };
  }
   cancelOrder = event => {
     event.preventDefault();
     Alerts.alert({
       title: "Cancel Order",
       type: "question",
       text: "You're about to cancel this order",
       showCancelButton: true
     }, (isConfirmed) => {
       if (isConfirmed) {
         const { order } = this.props;
         const { email } = order;
         const amount = order.billing[0].invoice.total;
         const transaction = {
           amount: Number(amount),
           to: email,
           from: email,
           transactionType: "credit"
         };
         Meteor.call("orders/cancelOrder", order, true);
         Meteor.call("wallet/update-balance",
           transaction,
           (err, res) => {
             if (res === "Error") {
               Alerts.toast(`No user with email ${email}`, "error");
             } else if (res === "Success") {
               Alerts.toast("Order successfully cancelled", "success");
               this.setState({
                 isCancelled: true
               });
             } else {
               Alerts.toast("An error occured, please try again", "error");
             }
           }
         );
       }
     });
   }
   render() {
     let headerText;
     if (!this.state.order) {
       return (
         <Components.NotFound
           i18nKeyTitle="order.notFound"
           icon="fa fa-barcode"
           title="Order Not Found"
         />
       );
     }
     if (this.state.isProfilePage) {
       headerText = (
         <p className="order-id">
           <strong>Order ID</strong>
           {this.state.orderId}
         </p>
       );
     } else {
       headerText = (
         <div className="order-details-header" > { /* This is the left side / main content */}
           <h3 >
             <Components.Translation
               defaultValue="Thank You"
               i18nKey="cartCompleted.thankYou"
             />
           </h3>
           <p>
             <strong>Order ID </strong>
             {this.state.orderId}
           </p> { /* show a different message depending on whether we have an email or not */}
           <AddEmail
             order={this.state.order}
             orderEmail={this.state.order.email}
           /> { /* This is the left side / main content */}
           {this.state.isCancelled ? (<p className="completed-cancel">Your order has been cancelled</p>) : " "}
         </div>
       );
     }
     return (
       <div className="container order-completed" >
         {headerText}
         <div className="order-details-main" >
           <div className="order-details-content-title" >
             <p>
               <Components.Translation
                 defaultValue="Your Items"
                 i18nKey="cartCompleted.yourItems"
               />
             </p >
           </div>
           {
             this.state.shops.map((shop) => {
               const shopKey = Object.keys(shop);
               return (
                 <CompletedShopOrders
                   shopName={
                     shop[shopKey].name
                   }
                   items={
                     shop[shopKey].items
                   }
                   key={
                     shopKey
                   }
                   shippingMethod={
                     shop[shopKey].shippingMethod
                   }
                   handleDisplayMedia={
                     this.state.handleDisplayMedia
                   }
                   isProfilePage={
                     this.state.isProfilePage
                   }
                 />
               );
             })
           }
         </div>
         <div className="order-details-side" >
           { /* This is the right side / side content */}
           <div className="shipping-payment-details" >
             <div className="shipping-info" >
               <div className="order-details-content-title" >
                 <p>
                   <Components.Translation
                     defaultValue="Shipping Address"
                     i18nKey="cartCompleted.shippingAddress"
                   />
                 </p>
               </div>
               {this.state.orderSummary.shipping.map((shipment) => {
                 if (shipment.address.fullName || shipment.address.address1) {
                   return (
                     <div
                       className="order-details-info-box"
                       key={shipment._id}
                     >
                       <div
                         className="order-details-info-box-content"
                       >
                         <p>
                           {shipment.address.fullName}
                           <br />
                           {shipment.address.address1}
                           <br />
                           {shipment.address.city},
                           {shipment.address.region}
                           {shipment.address.postal}
                           {shipment.address.country}
                         </p>
                       </div>
                     </div>);
                 }
               })
               }
             </div>
             <div className="payment-info" >
               <div className="order-details-content-title" >
                 <p>
                   <Components.Translation
                     defaultValue="Payment Method"
                     i18nKey="cartCompleted.paymentMethod"
                   />
                 </p >
               </div>
               {
                 this.state.paymentMethods.map(paymentMethod => (
                   <CompletedOrderPaymentMethod
                     key={paymentMethod.key}
                     paymentMethod={paymentMethod}
                   />))
               }
             </div>
           </div>
           <CompletedOrderSummary
             shops={
               this.state.shops
             }
             orderSummary={
               this.state.orderSummary
             }
             isProfilePage={
               this.state.isProfilePage
             }
           />
           { /* This is the right side / side content */}
           <br />
           <div className="row">
             <div className="col-md-12">
               {

                 !this.state.isCancelled &&
                 (<CancelOrderButton isCancelled={this.state.isCancelled} cancelOrder={this.cancelOrder} order={this.state.order} />)
               }
             </div>
           </div>
         </div>
       </div>
     );
   }
}

CompletedOrder.propTypes = {
  handleDisplayMedia: PropTypes.func,
  isProfilePage: PropTypes.bool,
  order: PropTypes.object,
  orderId: PropTypes.string,
  orderSummary: PropTypes.object,
  paymentMethods: PropTypes.array,
  shops: PropTypes.array
};
export default CompletedOrder;
