const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const AppError = require('../utils/appError');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      require: true,
      minlength: 7,
      select: false,
    },
    passwordConfirm: {
      type: String,
      require: true,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password are not the same',
      },
    },
    event: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        require: true,
      },
    ],
    image: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    confirmCode: {
      type: String,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.statics.updateEvent = async function (id, newEvent) {
  try {
    await this.updateOne(
      {
        _id: { $eq: id },
      },
      { $push: { event: newEvent } }
    );
  } catch (e) {
    throw new AppError('Update event fail', 400);
  }
};
userSchema.statics.deleteEvent = async function (eventId, userId) {
  try {
    await this.updateOne(
      {
        _id: { $eq: userId },
      },
      {
        $pull: { event: eventId },
      }
    );
  } catch (e) {
    throw new AppError('Delete event fail', 400);
  }
};
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 8);

  this.passwordConfirm = undefined;

  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
