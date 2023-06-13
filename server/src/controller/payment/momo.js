const axios = require('axios');
const crypto = require('crypto');
const catchAsync = require('../../utils/catchAsync');
const Transaction = require('../../models/transaction');
const { createReservationWithSeat } = require('../reservation');
const createPayment = async (data) => {
  let config = require('../../utils/momo');

  const { accessKey, secretKey, partnerCode, redirectUrl, url } = config;
  let ipnUrl = redirectUrl;

  let orderId = new Date().getTime();
  let requestId = partnerCode + orderId;
  let selectedSeat = data.selectedSeats;
  let orderSeat = selectedSeat.map((s) => `${s.row}-${s.col}`).join(',');
  let orderInfo = `${orderSeat}`;
  let amount = data.amount;
  let extraData = '';

  const order = new Transaction({
    _id: Number(orderId),
    selectedSeats: selectedSeat,
    total: data.total,
    user: data.user,
    eventId: data.eventId,
    amount: data.amount,
    date: data.date,
    venue: data.venue,
  });
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
  const { accessKey, secretKey } = config;
  let reservation;
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
    const transaction = await Transaction.findById(orderId);
    if (!transaction) {
      return {
        resultCode: '42',
        error: 'Invalid orderId or orderId is not found.	',
      };
    }

    const { selectedSeats, total, eventId, user, date, venue } = transaction;
    reservation = await createReservationWithSeat(
      date,
      venue,
      selectedSeats,
      total,
      eventId,
      user
    );
    if (reservation) {
      await Promise.all([
        Transaction.updateTransactionVerify(orderId, user),
        Transaction.deleteTransactionFail(user),
      ]);
    }
  } catch (e) {
    throw e;
  }
  return {
    type: 'momo',
    resultCode,
    message,
    reservation,
    amount,
  };
};

exports.verifyPaymentUrl = catchAsync(async (req, res, next) => {
  const dataCheck = await verifyPayment(req.query);
  res.json(dataCheck);
});
