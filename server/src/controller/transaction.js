const Transaction = require('../models/transaction');
const { createReservationWithSeat } = require('./reservation');
const AppError = require('../utils/appError');

exports.createTransaction = async (
  id,
  selectedSeats,
  total,
  user,
  eventId,
  amount,
  date,
  venue
) => {
  try {
    const order = new Transaction({
      _id: Number(id),
      selectedSeats: selectedSeats,
      total: total,
      user: user,
      eventId: eventId,
      amount: amount,
      date: date,
      venue: venue,
    });
    await order.save();
  } catch (e) {
    throw e;
  }
};

exports.verifyTransaction = async (id) => {
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      throw new AppError('No transactions have been made', 400);
    }

    const { selectedSeats, total, eventId, user, amount, date, venue } =
      transaction;
    const reservation = await createReservationWithSeat(
      date,
      venue,
      selectedSeats,
      total,
      eventId,
      user
    );
    await Promise.all([
      Transaction.updateTransactionVerify(id, user),
      Transaction.deleteTransactionFail(user),
    ]);

    return { reservation, amount };
  } catch (e) {
    throw e;
  }
};
