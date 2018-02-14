import collections from "../../lib/collections";
import Reaction from "../../server/api/core";

/**
 * @param {Object} user
 * @param {String} role
 * @returns {boolean}
 */

// eslint-disable-next-line no-undef
const Api = new Restivus({
  useDefaultAuth: true,
  prettyJson: true,
  version: "v1",
  defaultHeaders: {
    "Content-Type": "application/json"
  }
});

/**
 * @param {String} collectionName - Name of collection
 * @param {Object} collection - collection Schema
 * @param {Object} restApi - object
 * @returns none
 */
const createRestApiFor = (collectionName, collection, restApi = Api) => {
  restApi.addCollection(collection, {
    path: collectionName,
    routeOptions: { authRequired: true }
  });
};

export default () => {
  createRestApiFor("accounts", collections.Accounts);
  createRestApiFor("cart", collections.Cart);
  createRestApiFor("emails", collections.Emails);
  createRestApiFor("inventory", collections.Inventory);
  createRestApiFor("orders", collections.Orders);
  createRestApiFor("products", collections.Products);
  createRestApiFor("shops", collections.Shops);
  createRestApiFor("tags", collections.Tags);
  createRestApiFor("groups", collections.Groups);
  createRestApiFor("shipping", collections.Shipping);
};
