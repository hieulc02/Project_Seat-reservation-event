const axios = require('axios');
const crypto = require('crypto');
const catchAsync = require('../../utils/catchAsync');
const Transaction = require('../../models/transaction');
const { createReservationWithSeat } = require('../reservation');
const createPayment = async (data) => {
  let config = require('../../utils/momo');
  let accessKey = config.accessKey;
  let secretKey = config.secretKey;
  let partnerCode = config.partnerCode;
  let redirectUrl = config.redirectUrl;
  let ipnUrl = redirectUrl;
  let url = config.url;

  let requestId = partnerCode + new Date().getTime();
  let orderId = new Date().getTime();
  let selectedSeat = data.selectedSeats;
  let orderSeat = selectedSeat.map((s) => `${s.row}-${s.col}`).join(',');
  let orderInfo = `${orderSeat}`;
  let amount = data.total * 10000;
  let extraData = '';

  const order = new Transaction({
    _id: Number(orderId),
    selectedSeats: selectedSeat,
    total: data.total,
    user: data.user,
    eventId: data.eventId,
  });
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
    await order.save();
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
  let accessKey = config.accessKey;
  let secretKey = config.secretKey;
  const signatureRaw = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
  try {
    const signatureValue = await crypto
      .createHmac('sha256', secretKey)
      .update(signatureRaw)
      .digest('hex');
    if (signatureValue !== signature) {
      return { resultCode: '99', error: 'The transaction was not completed.' };
    }
    if (resultCode.toString() !== '0') {
      return {
        resultCode: '99',
        error: 'Process payment failed.',
      };
    }
    const transaction = await Transaction.findById(orderId);
    if (!transaction) {
      return {
        resultCode: '99',
        error: 'Process payment failed.',
      };
    }

    const { selectedSeats, total, eventId, user } = transaction;
    const reservation = await createReservationWithSeat(
      selectedSeats,
      total,
      eventId,
      user
    );
    if (reservation) {
      await Transaction.updateTransactionVerify(orderId, user);
    }
    await Transaction.deleteTransactionFail(user);
  } catch (e) {
    throw e;
  }
  return {
    type: 'momo',
    resultCode,
    message,
  };
};

exports.verifyPaymentUrl = catchAsync(async (req, res, next) => {
  const dataCheck = await verifyPayment(req.query);
  res.json(dataCheck);
});
