const cron = require('node-cron');
const User = require('../models/user');

function start() {
  cron.schedule('0 0 * * *', async () => {
    const inactiveUsers = await User.find({
      verified: false,
      registrationDate: { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
    });
    inactiveUsers.forEach(async (user) => {
      await user.remove();
    });
  });
}

module.exports = { start };
