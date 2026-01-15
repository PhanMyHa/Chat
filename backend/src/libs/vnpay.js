import crypto from "crypto";
import moment from "moment";
import { vnpayConfig } from "../config/vnpayConfig.js";

export const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
};

export const createVNPayUrl = (orderId, amount, orderInfo, ipAddr) => {
  const createDate = moment().format("YYYYMMDDHHmmss");

  let vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100, 
    vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    vnp_IpAddr: ipAddr || "127.0.0.1",
    vnp_CreateDate: createDate,
  };

  vnpParams = sortObject(vnpParams);

  const signData = new URLSearchParams(vnpParams).toString();
  const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnpParams["vnp_SecureHash"] = signed;

  const queryString = new URLSearchParams(vnpParams).toString();
  return vnpayConfig.vnp_Url + "?" + queryString;
};

// Xác thực chữ ký từ VNPay
export const verifyVNPaySignature = (vnpParams) => {
  const secureHash = vnpParams["vnp_SecureHash"];

  const params = { ...vnpParams };

  delete params["vnp_SecureHash"];
  delete params["vnp_SecureHashType"];

  const sortedParams = sortObject(params);

  const signData = new URLSearchParams(sortedParams).toString();
  const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return secureHash === signed;
};
