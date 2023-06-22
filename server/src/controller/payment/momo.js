const axios = require('axios');
const crypto = require('crypto');
const catchAsync = require('../../utils/catchAsync');
const { createTransaction, verifyTransaction } = require('../transaction');
const createPayment = async (data) => {
  let config = require('../../utils/momo');

  const { accessKey, secretKey, partnerCode, redirectUrl, url } = config;
  const { selectedSeats, total, user, eventId, amount, date, venue } = data;

  let ipnUrl = redirectUrl;
  let orderId = new Date().getTime();
  let requestId = partnerCode + orderId;
  let orderSeat = selectedSeats.map((s) => `${s.row}-${s.col}`).join(',');
  let orderInfo = `${orderSeat}`;
  let extraData = '';

  let requestType = 'captureWallet';

  // let requestType = 'payWithATM';
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
    await createTransaction(
      orderId,
      selectedSeats,
      total,
      user,
      eventId,
      amount,
      date,
      venue
    );
    const response = await axios.post(url, requestBody);
    return response.data;
  } catch (e) {
    throw e;
  }
};

exports.createPaymentUrl = catchAsync(async (req, res, next) => {
  const paymentData = await createPayment(req.body);
  res.json(paymentData);
});

const verifyPayment = async ({
  partnerCode,
  orderId,
  requestId,
  amount,
  orderInfo,
  orderType,
  transId,
  resultCode,
  message,
  payType,
  responseTime,
  extraData,
  signature,
}) => {
  let config = require('../../utils/momo');
  const { accessKey, secretKey } = config;
  const signatureRaw = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
  try {
    const signatureValue = await crypto
      .createHmac('sha256', secretKey)
      .update(signatureRaw)
      .digest('hex');

    if (signatureValue !== signature) {
      return { resultCode: '20', error: 'Bad format request.' };
    }
    if (resultCode !== '0') {
      return {
        resultCode: '99',
        error: 'Unknown error.',
      };
    }
    const { reservation } = await verifyTransaction(orderId);

    return {
      type: 'momo',
      resultCode,
      message,
      reservation,
      amount,
    };
  } catch (e) {
    throw e;
  }
};

exports.verifyPaymentUrl = catchAsync(async (req, res, next) => {
  const dataCheck = await verifyPayment(req.query);
  res.json(dataCheck);
});
