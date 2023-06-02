const moment = require('moment');
const catchAsync = require('../../utils/catchAsync');
const Transaction = require('../../models/transaction');
const { createReservationWithSeat } = require('../reservation');
exports.createPaymentUrl = catchAsync(async (req, res, next) => {
  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');
  let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  let config = require('../../utils/vnpay');

  let tmnCode = config.vnp_TmnCode;
  let secretKey = config.vnp_HashSecret;
  let vnpUrl = config.vnp_Url;
  let returnUrl = config.vnp_ReturnUrl;

  let orderId = moment(date).format('DDHHmmss');
  const order = new Transaction({
    _id: orderId,
    selectedSeats: req.body.selectedSeats,
    total: req.body.total,
    user: req.body.user,
    eventId: req.body.eventId,
  });
  let price = req.body.ticketPrice;
  let amount = req.body.total;
  let bankCode = req.body?.bankCode || '';
  let locale = req.body?.language || 'vn';
  let selectedSeat = req.body.selectedSeats;
  let orderSeat = selectedSeat.map((s) => `${s.row}-${s.col}`);
  let orderInfo = orderSeat;
  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * price * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }
  vnp_Params = sortObject(vnp_Params);
  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });

  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf8')).digest('hex');

  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  await order.save();

  res.status(200).json({ paymentUrl: vnpUrl });
});
exports.verifyPaymentUrl = catchAsync(async (req, res, next) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params['vnp_SecureHash'];
  let id = vnp_Params['vnp_TxnRef'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let config = require('../../utils/vnpay');

  let secretKey = config.vnp_HashSecret;

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);

  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  if (secureHash === signed) {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(400).json({
        type: 'vnpay',
        code: '97',
      });
    }

    const { selectedSeats, total, eventId, user } = transaction;
    const reservation = await createReservationWithSeat(
      selectedSeats,
      total,
      eventId,
      user
    );
    if (reservation) {
      await Transaction.updateTransactionVerify(id, user);
    }
    await Transaction.deleteTransactionFail(user);
    res.status(200).json({
      type: 'vnpay',
      code: vnp_Params['vnp_ResponseCode'],
    });
  } else {
    res.status(200).json({ type: 'vnpay', code: '97' });
  }
});

const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
};
