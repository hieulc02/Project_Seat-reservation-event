const mongoose = require('mongoose');
//const { use } = require('../app');
//const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
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
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 8);

  this.passwordConfirm = undefined;

  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
