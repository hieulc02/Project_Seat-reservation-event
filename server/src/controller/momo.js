const axios = require('axios');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');

const createPayment = async (data) => {
  let config = require('../utils/momo');
  let accessKey = config.accessKey;
  let secretKey = config.secretKey;
  let partnerCode = config.partnerCode;
  let redirectUrl = config.redirectUrl;
  let ipnUrl = redirectUrl;
  let url = config.url;

  let requestId = partnerCode + new Date().getTime();
  let orderId = requestId;
  let selectedSeat = data.selectedSeats;
  let orderSeat = selectedSeat.map((s) => `${s.row}-${s.col}`).join(',');
  let orderInfo = `${orderSeat}`;
  let amount = data.total * 10000;
  let extraData = '';

  let requestType = 'captureWallet';

  let rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType;

  let signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = {
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: 'en',
  };
  try {
    const response = await axios.post(url, requestBody);
    return response.data;
  } catch (e) {
    throw e;
  }
};

const createPaymentUrl = catchAsync(async (req, res, next) => {
  const paymentData = await createPayment(req.body);
  res.json(paymentData);
});

module.exports = { createPayment, createPaymentUrl };
