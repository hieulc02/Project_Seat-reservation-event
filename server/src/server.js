const mongoose = require('mongoose');
const app = require('./app');
const server = require('./app');

const port = process.env.PORT || 3001;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connect success');
  });

server.listen(port, () => {
  console.log(`listen on ${port}...`);
});
