const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    _id: {
      type: Number,
      require: true,
    },
    selectedSeats: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Seat',
        required: true,
      },
    ],
    total: {
      type: Number,
      require: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
transactionSchema.pre(/^find/, function (next) {
  this.populate('selectedSeats').populate('user').populate('eventId');

  next();
});
transactionSchema.statics.updateTransactionVerify = async function (id, user) {
  try {
    await this.updateOne(
      {
        _id: {
          $eq: id,
        },
        user: {
          $eq: user,
        },
      },
      {
        $set: { isVerified: true },
      }
    );
  } catch (e) {
    throw new Error('Update transaction fail!');
  }
};

transactionSchema.statics.deleteTransactionFail = async function (user) {
  try {
    await this.deleteMany({
      user: { $eq: user },
      isVerified: false,
    });
  } catch (e) {
    throw new Error('Delete fail');
  }
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
