import request from "request";

/**
 * @description: sets secretKey in the request headers
 *
 * @param {string} secret: value to set in headers
 *
 * @return {object} headers object
 */
const paystackHeaders = secret => ({
  "Authorization": `Bearer ${secret}`,
  "Content-Type": "application/json"
});

/**
 * @description: consumes an API to verifies the validity of
 * transaction with the generated referenceId
 *
 * @param {object} reference: a stringified paystack reference
 * object containing referenceId
 * @param {string} secretKey: the secretKey given from paystack
 * @param {function} callback: callback function
 *
 * @return {object} headers object
 */
const verifyPayment = (reference, secretKey, callback) => {
  const referenceId = reference;
  const headers = paystackHeaders(secretKey);
  const url = `https://api.paystack.co/transaction/verify/${referenceId}`;
  request.get(url, { headers }, (err, response, body) => {
    const res = JSON.parse(body);
    if (res.status) {
      callback(null, res);
    } else {
      callback(res, null);
    }
  });
};

export default verifyPayment;
