const mongoose = require('mongoose');

const { Schema } = mongoose;

const reservationSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    // startAt: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    seats: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Seat',
        required: true,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    checkIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reservationSchema.pre(/^find/, function (next) {
  this.populate('user')
    .populate({
      path: 'event',
      select: 'name',
    })
    .populate('seats');

  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
